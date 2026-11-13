# SEO 靜態內容維護

本專案保留原本的純 HTML／JavaScript 架構。更新 `content/*.json` 後，在此目錄執行：

```powershell
node scripts/build-seo.cjs
```

使用 Node.js 22 或更新版本，不需安裝 npm 套件。指令會：

- 重建首頁、作品列表、關於、服務的初始 HTML，以及五個主要頁面的導覽與 metadata。
- 為各相簿建立 `album-<slug>.html`；保留原有分類、輪播及燈箱功能。
- 建立 `assets/js/image-sizes.js`，讓前端圖片帶有寬高，減少載入時的版面位移。
- 從同一份內容產生基本 Organization JSON-LD。
- 以 `scripts/generated-albums.json` 追蹤生成頁面。相簿從 JSON 刪除後，僅移除清單內且帶有生成標記的舊頁，不刪除手動建立的其他檔案。

`album-*.html` 是生成檔，請修改 `content/albums.json`，不要直接修改生成頁。相簿 slug 限小寫英文字母、數字與連字號，且不可重複。

舊網址 `album.html?id=...` 在 Node 伺服器會 301 到新作品頁；靜態主機則由 JavaScript 轉往新頁。舊相簿殼頁帶 noindex，新作品頁可索引。舊連結在停用 JavaScript 的靜態主機環境下只顯示返回作品集連結；若需要伺服器端 301，請使用 Node 或配置正式主機的轉址規則。

## 正式網址

在 `seo.config.json` 填入 `siteUrl`，必須是真實的 HTTPS 正式網址，可包含部署子目錄；再執行建置。

- `siteUrl` 空白時不產生 canonical、sitemap 或假網域。
- 填妥後自動寫入各公開頁 self-canonical、`og:url`、`og:image`、`sitemap.xml` 及 robots 的 Sitemap 宣告。
- 後台、舊相簿殼頁與 noindex 頁不進 sitemap。
- `shareImage` 是專案內的分享圖相對路徑，可更換成正式分享圖。
- 可由部署環境的 `SEO_SITE_URL` 覆寫 `siteUrl`；請勿把預覽網域當正式網址。

現有 GitHub Actions 縮圖流程已加入 SEO 建置。圖片、內容 JSON、SEO 設定或建置腳本更新時，會更新生成檔；本次只修改 workflow，尚未在 GitHub 執行或發布。

正式聯絡方式與資歷請在確認後修改 `content/site.json`、`content/about.json`，再重建。未提供的資料不會由程式猜測。
