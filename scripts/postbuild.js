import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, '../build/client');
const dest = path.join(__dirname, '../dist');

console.log('Copying build/client to dist for Vercel deployment...');

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}

if (fs.existsSync(source)) {
  fs.cpSync(source, dest, { recursive: true });
  console.log('Successfully copied build output to dist directory!');
} else {
  console.error('build/client directory not found! Build might have failed.');
}
