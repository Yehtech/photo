/**
 * LUMEN Photography - Lightweight Local Web Server & Booking Engine
 * Built using Node.js built-in modules (Zero dependencies needed)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { execFile } = require('child_process');

const PORT = process.env.PORT || 3001;
const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, '[]', 'utf8');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function readBookings() {
  try {
    const raw = fs.readFileSync(BOOKINGS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading bookings.json:', err);
    return [];
  }
}

function writeBookings(data) {
  try {
    const tmp = `${BOOKINGS_FILE}.${Date.now()}.${Math.random().toString(36).substring(7)}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmp, BOOKINGS_FILE);
    return true;
  } catch (err) {
    console.error('Error writing bookings.json:', err);
    return false;
  }
}

function speak(message) {
  if (!message || typeof message !== 'string') return;
  const scriptPath = path.join(BASE_DIR, 'say.ps1');
  if (!fs.existsSync(scriptPath)) return;

  const cleanMsg = message.replace(/[^\w\s\u4e00-\u9fa5,，。!！?？\-]/gi, '').trim().slice(0, 100);
  if (!cleanMsg) return;

  execFile('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', scriptPath, cleanMsg], { windowsHide: true }, (err) => {
    if (err) console.error('TTS voice error:', err.message);
  });
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        if (!body.trim()) return resolve({});
        // Handle application/json or urlencoded
        if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
          const qs = require('querystring');
          return resolve(qs.parse(body));
        }
        resolve(JSON.parse(body));
      } catch (e) {
        // Fallback for form-encoded string
        try {
          const qs = require('querystring');
          resolve(qs.parse(body));
        } catch (err) {
          reject(e);
        }
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-admin-token'
    });
    return res.end();
  }

  // API 1: GET /api/bookings (List bookings for admin)
  if (pathname === '/api/bookings' && req.method === 'GET') {
    const list = readBookings();
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sendJson(res, 200, { success: true, total: list.length, bookings: list });
  }

  // API 2: POST /api/bookings or POST / (Handle booking submit)
  if ((pathname === '/api/bookings' || pathname === '/') && req.method === 'POST') {
    try {
      const data = await parseJsonBody(req);
      const name = (data.name || '').trim();
      const email = (data.email || '').trim();
      const phone = (data.phone || '').trim();
      const line = (data.line || '').trim();
      const type = (data.type || '未指定').trim();
      const date = (data.date || '').trim();
      const message = (data.message || '').trim();

      if (!name || !email) {
        return sendJson(res, 400, { success: false, message: '請填寫姓名與 Email' });
      }

      // Generate booking number
      const now = new Date();
      const ymd = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
      const suffix = Math.floor(1000 + Math.random() * 9000);
      const bookingNumber = `PHO-${ymd}-${suffix}`;

      // Price estimation logic
      let basePrice = 4800;
      if (type.includes('婚禮') || type.includes('婚紗')) basePrice = 18000;
      else if (type.includes('商業') || type.includes('品牌')) basePrice = 8000;
      const deposit = Math.round(basePrice * 0.3);

      const newBooking = {
        id: `ord_${Date.now()}`,
        bookingNumber,
        createdAt: now.toISOString(),
        name,
        email,
        phone,
        line,
        type,
        date: date || '尚未決定',
        message,
        status: '待溝通',
        deposit,
        totalEstimate: basePrice
      };

      const bookings = readBookings();
      bookings.unshift(newBooking);
      writeBookings(bookings);

      // Audio notification
      speak('收到新的拍攝預約訂單');

      return sendJson(res, 201, {
        success: true,
        message: '預約諮詢已成功送出！攝影師將盡快與您聯繫。',
        bookingNumber,
        booking: newBooking
      });
    } catch (err) {
      console.error('Booking creation error:', err);
      return sendJson(res, 500, { success: false, message: '伺服器處理錯誤' });
    }
  }

  // API 3: PUT /api/bookings/:id/status (Update booking status)
  if (pathname.startsWith('/api/bookings/') && pathname.endsWith('/status') && req.method === 'PUT') {
    const parts = pathname.split('/');
    const id = parts[3];
    try {
      const body = await parseJsonBody(req);
      const bookings = readBookings();
      const item = bookings.find(b => b.id === id || b.bookingNumber === id);
      if (!item) {
        return sendJson(res, 404, { success: false, message: '找不到該預約' });
      }
      if (body.status) item.status = body.status;
      if (body.note) item.internalNote = body.note;
      item.updatedAt = new Date().toISOString();
      writeBookings(bookings);
      return sendJson(res, 200, { success: true, message: '預約狀態已更新', booking: item });
    } catch (err) {
      return sendJson(res, 500, { success: false, message: '更新失敗' });
    }
  }

  // API 4: DELETE /api/bookings/:id
  if (pathname.startsWith('/api/bookings/') && req.method === 'DELETE') {
    const id = pathname.split('/')[3];
    let bookings = readBookings();
    const len = bookings.length;
    bookings = bookings.filter(b => b.id !== id && b.bookingNumber !== id);
    if (bookings.length === len) {
      return sendJson(res, 404, { success: false, message: '找不到該預約' });
    }
    writeBookings(bookings);
    return sendJson(res, 200, { success: true, message: '已刪除預約' });
  }

  // Unknown album identifiers are missing resources, not successful pages.
  if (pathname === '/album.html' || pathname === '/album') {
    try {
      const albums = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'content', 'albums.json'), 'utf8'));
      if (!albums.some(album => album.slug === reqUrl.searchParams.get('id'))) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' });
        return res.end('<!DOCTYPE html><html lang="zh-Hant"><meta charset="utf-8"><title>找不到作品</title><h1>找不到這組作品</h1><a href="works.html">回作品集</a></html>');
      }
      const target = `album-${encodeURIComponent(reqUrl.searchParams.get('id'))}.html`;
      if (fs.existsSync(path.join(BASE_DIR, target))) {
        res.writeHead(301, { Location: `/${target}` });
        return res.end();
      }
    } catch (err) {
      res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('作品資料暫時無法讀取');
    }
  }

  // Static File Serving
  let filePath = path.join(BASE_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security: Prevent path traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403);
    return res.end('Access denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If extensionless, try .html
      if (!path.extname(filePath)) {
        const tryHtml = `${filePath}.html`;
        if (fs.existsSync(tryHtml)) {
          filePath = tryHtml;
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('404 Not Found');
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('404 Not Found');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log('===========================================================');
    console.log(`  ★ LUMEN Photography 攝影師作品與接單系統已成功啟動 ★`);
    console.log(`  前台官網: http://localhost:${PORT}`);
    console.log(`  接單後台: http://localhost:${PORT}/admin.html`);
    console.log('===========================================================');
  });
}

module.exports = server;
