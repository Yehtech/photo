"""
產生縮圖：images/uploads/xxx.jpg  ->  images/thumbs/xxx.jpg

- 長邊縮到 900px（比這小的照片不會放大）
- 依照片方向資訊自動轉正，並移除 EXIF（避免 GPS 位置等資訊外流）
- 用 images/thumbs/.manifest.json 記錄每張原圖的指紋，
  只處理「新增」或「被替換過」的照片；原圖刪除時也會一併刪掉縮圖
  （只刪本程式產生過的縮圖，手動放進 thumbs 的檔案不會被刪）
- GIF 不處理（網頁找不到縮圖時會自動改用原圖，動畫得以保留）

本機執行：  python scripts/make_thumbs.py
GitHub 上由 .github/workflows/thumbnails.yml 自動執行。
"""
import hashlib
import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "images" / "uploads"
OUT_DIR = ROOT / "images" / "thumbs"
MANIFEST = OUT_DIR / ".manifest.json"

MAX_SIZE = 900
EXTS = {".jpg", ".jpeg", ".png", ".webp"}
IN_CI = os.environ.get("GITHUB_ACTIONS") == "true"


def warn(msg: str) -> None:
    # 在 GitHub Actions 中會顯示成黃色警告
    print(f"::warning::{msg}" if IN_CI else f"[警告] {msg}")


def fingerprint(path: Path) -> str:
    h = hashlib.sha1()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def make_thumb(src: Path, dst: Path) -> None:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        im.thumbnail((MAX_SIZE, MAX_SIZE), Image.Resampling.LANCZOS)
        ext = src.suffix.lower()
        if ext in (".jpg", ".jpeg"):
            if im.mode != "RGB":
                im = im.convert("RGB")
            im.save(dst, "JPEG", quality=82, optimize=True, progressive=True)
        elif ext == ".png":
            im.save(dst, "PNG", optimize=True)
        elif ext == ".webp":
            im.save(dst, "WEBP", quality=80, method=6)


def main() -> int:
    if not SRC_DIR.is_dir():
        print(f"找不到 {SRC_DIR}，略過。")
        return 0
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    try:
        old = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except (FileNotFoundError, ValueError):
        old = {}

    new: dict[str, str] = {}
    created = updated = skipped = failed = 0

    for src in sorted(SRC_DIR.iterdir()):
        if not src.is_file() or src.suffix.lower() not in EXTS:
            continue
        dst = OUT_DIR / src.name
        fp = fingerprint(src)
        if dst.exists() and old.get(src.name) == fp:
            new[src.name] = fp
            skipped += 1
            continue
        existed = dst.exists()
        try:
            make_thumb(src, dst)
        except Exception as e:  # 壞檔不讓整個流程失敗，網頁會自動改用原圖
            warn(f"無法產生縮圖 {src.name}：{e}")
            failed += 1
            continue
        new[src.name] = fp
        if existed:
            updated += 1
            print(f"更新  {src.name}")
        else:
            created += 1
            print(f"新增  {src.name}")

    # 原圖已刪除 -> 刪掉對應縮圖
    # 只刪「本程式產生過」（記錄在 manifest 裡）的縮圖；其他手動放進來的檔案只提醒、不刪除
    removed = 0
    for thumb in OUT_DIR.iterdir():
        if not (thumb.is_file() and thumb.suffix.lower() in EXTS) or (SRC_DIR / thumb.name).exists():
            continue
        if thumb.name in old:
            thumb.unlink()
            removed += 1
            print(f"刪除  {thumb.name}（原圖已不存在）")
        else:
            warn(f"images/thumbs/{thumb.name} 沒有對應的原圖。照片請放在 images/uploads/，這個檔案不會被自動刪除。")

    if new != old:
        MANIFEST.write_text(json.dumps(new, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    print(f"完成：新增 {created}、更新 {updated}、刪除 {removed}、未變動 {skipped}、失敗 {failed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
