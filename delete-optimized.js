import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, 'public', 'images');

// Regex to match optimized image suffixes like -400.avif, -800.webp, -1200.jpg, -1600.png
const optimizedPattern = /-\d{3,4}\.(avif|webp|jpg|jpeg|png)$/i;

function cleanDirectory(directory) {
  if (!fs.existsSync(directory)) return;

  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      cleanDirectory(fullPath);
    } else {
      if (optimizedPattern.test(file)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`Deleted: ${fullPath}`);
        } catch (err) {
          console.error(`Failed to delete ${fullPath}: ${err.message}`);
        }
      }
    }
  });
}

console.log('Starting cleanup of optimized images...');
cleanDirectory(targetDir);
console.log('Cleanup complete!');
