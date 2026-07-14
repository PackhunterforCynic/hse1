import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';
import { CONFIG, processImage, isSupportedFile, isGeneratedFile } from './optimize-images.js';

console.log(`👀 Watching ${CONFIG.publicDir} for new images...`);

const watcher = chokidar.watch(CONFIG.publicDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true, // Don't process everything on startup
});

const handleFile = async (filePath) => {
  const ext = path.extname(filePath);
  const filename = path.basename(filePath);

  if (isSupportedFile(ext) && !isGeneratedFile(filename)) {
    console.log(`\n📄 Detected change: ${filename}`);
    // Optional delay to ensure file is fully written before processing
    setTimeout(() => {
      processImage(filePath);
    }, 500);
  }
};

watcher
  .on('add', handleFile)
  .on('change', handleFile)
  .on('error', error => console.log(`Watcher error: ${error}`));

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nStopping watcher...');
  watcher.close().then(() => process.exit(0));
});
