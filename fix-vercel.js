import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const oldPath = path.join(__dirname, 'public', 'projects');
const newPath = path.join(__dirname, 'public', 'content');

try {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log('✅ Successfully renamed public/projects to public/content!');
  } else {
    console.log('✅ The directory is already renamed.');
  }
} catch (err) {
  console.error('❌ Failed to rename directory:', err.message);
}
