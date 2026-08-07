import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, '../build/client');
const distDest = path.join(__dirname, '../dist');
const buildRootDest = path.join(__dirname, '../build');

console.log('Copying SPA output for Vercel deployment...');

// Resilient copy helper with retry mechanism for Windows folder locks and pending deletions
function safeCopySync(src, dest, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      if (fs.existsSync(src) && fs.statSync(src).isDirectory() && !fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.cpSync(src, dest, { recursive: true, force: true, dereference: true });
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      // Brief synchronous pause to allow OS file handles to release
      const start = Date.now();
      while (Date.now() - start < 200) {}
    }
  }
}

// 1. Copy to dist/ (If Vercel or Hostinger is set to Vite dist folder)
if (fs.existsSync(distDest)) {
  try {
    fs.rmSync(distDest, { recursive: true, force: true });
  } catch (e) {
    // Ignore harmless rm lock errors on Windows
  }
}

if (fs.existsSync(source)) {
  safeCopySync(source, distDest);
  console.log('✅ Copied to dist/ directory');
  
  // 2. Copy contents of build/client to build/ root directory
  const files = fs.readdirSync(source);
  for (const file of files) {
    safeCopySync(path.join(source, file), path.join(buildRootDest, file));
  }
  console.log('✅ Copied to build/ root directory');
} else {
  console.error('❌ build/client directory not found! Build might have failed.');
  process.exit(1);
}
