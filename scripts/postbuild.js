import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, '../build/client');
const distDest = path.join(__dirname, '../dist');
const buildRootDest = path.join(__dirname, '../build');

console.log('Copying SPA output for Vercel deployment...');

// 1. Copy to dist/ (If Vercel is set to Vite)
if (fs.existsSync(distDest)) {
  fs.rmSync(distDest, { recursive: true, force: true });
}
if (fs.existsSync(source)) {
  fs.cpSync(source, distDest, { recursive: true });
  console.log('✅ Copied to dist/ directory');
  
  // 2. Copy contents of build/client to build/ (If Vercel is set to Create React App / Remix)
  const files = fs.readdirSync(source);
  for (const file of files) {
    fs.cpSync(path.join(source, file), path.join(buildRootDest, file), { recursive: true });
  }
  console.log('✅ Copied to build/ root directory');
} else {
  console.error('❌ build/client directory not found! Build might have failed.');
  process.exit(1);
}
