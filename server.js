import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// API Route Handlers
import contactHandler from './api/contact.js';
import chatHandler from './api/chat.js';
import internshipHandler from './api/internship.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hostinger assigns port dynamically via process.env.PORT
const PORT = process.env.PORT || 3000;

// Determine static directory (prefer dist/, fallback to build/client or build/)
const possibleStaticDirs = [
  path.join(__dirname, 'dist'),
  path.join(__dirname, 'build', 'client'),
  path.join(__dirname, 'build')
];
const STATIC_DIR = possibleStaticDirs.find(dir => fs.existsSync(dir)) || path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // 1. Security Shield: Block direct URL viewing of confidential studio repositories
  if (pathname.match(/\/(chats-history|contact-leads|internships-archive|chat|strategy)\.(json|txt)$/i)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(
      '<div style="background:#050505;color:#ef4444;font-family:-apple-system,BlinkMacSystemFont,monospace;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem;margin:0;">' +
      '<div style="border:1px solid #ef444433;padding:2.5rem 3rem;border-radius:1.5rem;background:#080808;box-shadow:0 0 40px rgba(239,68,68,0.2);max-width:620px;">' +
      '<div style="font-size:2rem;margin-bottom:1rem;">🛡️</div>' +
      '<h1 style="font-size:1.75rem;letter-spacing:0.2em;margin-bottom:0.75rem;color:#ef4444;font-family:monospace;">403 FORBIDDEN</h1>' +
      '<p style="color:#efe6d2;font-size:1.05rem;margin-bottom:0.75rem;font-weight:600;letter-spacing:0.05em;">HAVILAH STUDIO CONFIDENTIAL VAULT</p>' +
      '<p style="color:#9ca3af;font-size:0.875rem;line-height:1.6;">Access Denied: Direct HTTP retrieval of confidential client consultative telemetry, contact CRM leads, and talent recruitment dossiers is strictly restricted by executive security protocol.</p>' +
      '<a href="/" style="display:inline-block;margin-top:1.5rem;padding:0.65rem 1.5rem;background:#efe6d2;color:#000;text-decoration:none;border-radius:0.75rem;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Return to Website</a>' +
      '</div></div>'
    );
    return;
  }

  // 2. Handle Backend API Routes (/api/*)
  if (pathname.startsWith('/api/')) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        req.body = {};
      }
      req.query = Object.fromEntries(urlObj.searchParams.entries());

      // Attach Vercel-style response helper methods
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(data));
      };

      try {
        if (pathname === '/api/contact' && req.method === 'POST') {
          await contactHandler(req, res);
        } else if (pathname === '/api/chat' && req.method === 'POST') {
          await chatHandler(req, res);
        } else if (pathname === '/api/internship' && req.method === 'POST') {
          await internshipHandler(req, res);
        } else {
          res.status(404).json({ error: 'API Route Not Found' });
        }
      } catch (err) {
        console.error(`[Hostinger Server] Error in API Route ${pathname}:`, err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.end();
        }
      }
    });
    return;
  }

  // 3. Serve Static Files from SPA output with SPA routing fallback
  let filePath = path.join(STATIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // Check if file exists; if not or if it's a folder without index, fallback to SPA index.html
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    } else {
      filePath = path.join(STATIC_DIR, 'index.html');
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' || ext === '.js' && filePath.endsWith('sw.js')
        ? 'max-age=0, no-cache, must-revalidate'
        : 'public, max-age=31536000, immutable'
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server Error loading file: ' + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`[Hostinger Server] 🌟 Havilah Studio online on port ${PORT}`);
  console.log(`[Hostinger Server] 📁 Serving static directory: ${STATIC_DIR}`);
});
