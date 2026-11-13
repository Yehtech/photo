"""LUMEN Photography - Local Preview & Booking Handler in Python."""

import http.server
import json
import os
import socket
import sys
import webbrowser
from datetime import datetime
from subprocess import Popen

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PORT = 3001
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
BOOKINGS_FILE = os.path.join(DATA_DIR, "bookings.json")

os.makedirs(DATA_DIR, exist_ok=True)
if not os.path.exists(BOOKINGS_FILE):
    with open(BOOKINGS_FILE, "w", encoding="utf-8") as f:
        f.write("[]")


def read_bookings():
    try:
        with open(BOOKINGS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def write_bookings(data):
    try:
        with open(BOOKINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print("Error saving bookings:", e)
        return False


def speak(message):
    if not message or not isinstance(message, str):
        return
    script = os.path.join(BASE_DIR, "say.ps1")
    if os.path.exists(script):
        try:
            Popen(["powershell.exe", "-ExecutionPolicy", "Bypass", "-File", script, message])
        except Exception as e:
            print("TTS error:", e)


class PhotoHandler(http.server.SimpleHTTPRequestHandler):

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, x-admin-token")
        self.end_headers()

    def do_GET(self):
        # API: GET /api/bookings
        if self.path == "/api/bookings" or self.path.startswith("/api/bookings?"):
            bookings = read_bookings()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "total": len(bookings),
                "bookings": bookings
            }, ensure_ascii=False).encode("utf-8"))
            return

        super().do_GET()

    def do_POST(self):
        # API: POST /api/bookings or POST /
        if self.path in ("/api/bookings", "/"):
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(body)
            except Exception:
                from urllib.parse import parse_qs
                parsed = parse_qs(body)
                data = {k: v[0] for k, v in parsed.items()}

            now = datetime.now()
            b_num = f"PHO-{now.strftime('%Y%m%d')}-{now.strftime('%H%M%S')[-4:]}"
            item_type = (data.get("type") or "未指定").strip()

            # Estimate deposit
            base_price = 4800
            if "婚禮" in item_type or "婚紗" in item_type:
                base_price = 18000
            elif "商業" in item_type or "品牌" in item_type:
                base_price = 8000
            deposit = int(round(base_price * 0.3))

            item = {
                "id": f"ord_{int(now.timestamp()*1000)}",
                "bookingNumber": b_num,
                "createdAt": now.isoformat(),
                "name": (data.get("name") or "").strip(),
                "email": (data.get("email") or "").strip(),
                "phone": (data.get("phone") or "").strip(),
                "line": (data.get("line") or "").strip(),
                "type": item_type,
                "date": (data.get("date") or "尚未決定").strip(),
                "message": (data.get("message") or "").strip(),
                "status": "待溝通",
                "deposit": deposit,
                "totalEstimate": base_price
            }

            bookings = read_bookings()
            bookings.insert(0, item)
            write_bookings(bookings)
            speak("收到新的拍攝預約訂單")

            self.send_response(201)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "message": "預約諮詢已成功送出！攝影師將盡快與您聯繫。",
                "bookingNumber": b_num,
                "booking": item
            }, ensure_ascii=False).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def do_PUT(self):
        # API: PUT /api/bookings/:id/status
        if self.path.startswith("/api/bookings/") and self.path.endswith("/status"):
            parts = self.path.split("/")
            bid = parts[3]
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(body)
            except Exception:
                data = {}

            bookings = read_bookings()
            target = next((b for b in bookings if b.get("id") == bid or b.get("bookingNumber") == bid), None)
            if not target:
                self.send_response(404)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "message": "找不到該預約"}, ensure_ascii=False).encode("utf-8"))
                return

            if "status" in data:
                target["status"] = data["status"]
            if "note" in data:
                target["internalNote"] = data["note"]
            target["updatedAt"] = datetime.now().isoformat()

            write_bookings(bookings)

            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "message": "預約狀態已更新", "booking": target}, ensure_ascii=False).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def do_DELETE(self):
        # API: DELETE /api/bookings/:id
        if self.path.startswith("/api/bookings/"):
            parts = self.path.split("/")
            bid = parts[3]
            bookings = read_bookings()
            initial_count = len(bookings)
            bookings = [b for b in bookings if b.get("id") != bid and b.get("bookingNumber") != bid]
            if len(bookings) == initial_count:
                self.send_response(404)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "message": "找不到該預約"}, ensure_ascii=False).encode("utf-8"))
                return

            write_bookings(bookings)
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "message": "已刪除預約"}, ensure_ascii=False).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()


if __name__ == "__main__":
    os.chdir(BASE_DIR)
    url = f"http://localhost:{PORT}/index.html"
    print("=" * 60)
    print("  ★ LUMEN Photography 攝影師作品與接單伺服器 (Python)")
    print(f"  前台首頁: {url}")
    print(f"  接單後台: http://localhost:{PORT}/admin.html")
    print("=" * 60)
    try:
        webbrowser.open(url)
    except Exception:
        pass
    with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), PhotoHandler) as httpd:
        httpd.serve_forever()
