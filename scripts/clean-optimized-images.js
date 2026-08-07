import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images');

let deletedCount = 0;
let deletedSize = 0;

function cleanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      cleanDir(fullPath);
    } else {
      // Match generated files like: -1280.webp, -blur.webp, -fallback.jpg, .json
      if (
        file.match(/-(1280|1920|480|768|blur|fallback.*)\.(webp|jpg|png|avif)$/i) || 
        file.endsWith('.json')
      ) {
        const stats = fs.statSync(fullPath);
        deletedSize += stats.size;
        fs.unlinkSync(fullPath);
        deletedCount++;
        console.log(`Deleted: ${path.relative(imagesDir, fullPath)}`);
      }
    }
  }
}

console.log('Scanning for optimized images in public/images...');
cleanDir(imagesDir);
console.log(`\nDone! Deleted ${deletedCount} files.`);
console.log(`Total space freed: ${(deletedSize / (1024 * 1024)).toFixed(2)} MB`);
