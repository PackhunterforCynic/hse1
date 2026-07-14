import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, 'public', 'images');

// Regex to match ONLY .avif files
const avifPattern = /\.avif$/i;

function cleanDirectory(directory) {
  if (!fs.existsSync(directory)) return;

  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      cleanDirectory(fullPath);
    } else {
      if (avifPattern.test(file)) {
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

console.log('Starting deletion of all AVIF files...');
cleanDirectory(targetDir);
console.log('Cleanup complete! All slow AVIF files removed.');
