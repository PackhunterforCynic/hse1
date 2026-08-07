import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration object
export const CONFIG = {
  widths: [400, 800, 1200, 1600],
  avifQuality: 60,
  webpQuality: 80,
  generateBlur: false,
  concurrency: 4,
  publicDir: path.resolve(__dirname, '../public'),
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
};

// Patterns to skip
export const isGeneratedFile = (filename) => {
  return /-\d+(w|px)?\.(webp|avif)$/.test(filename) || 
         /-blur\.webp$/.test(filename) || 
         filename === 'fallback.webp';
};

export const isSupportedFile = (ext) => {
  return CONFIG.supportedExtensions.includes(ext.toLowerCase());
};

export async function processImage(filePath) {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const dirName = path.dirname(filePath);
  const relativePath = path.relative(CONFIG.publicDir, filePath);
  const fileInfo = `[${relativePath}]`;
  let processedCount = 0;

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    const processFormat = async (format, quality, width) => {
      const outName = `${baseName}-${width}.${format}`;
      const outPath = path.join(dirName, outName);
      
      // Generating it safely
      if (format === 'avif') {
        await image.clone().resize({ width, withoutEnlargement: true }).avif({ quality }).toFile(outPath);
      } else if (format === 'webp') {
        await image.clone().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(outPath);
      }
      processedCount++;
    };

    const tasks = [];

    for (const width of CONFIG.widths) {
      tasks.push(processFormat('avif', CONFIG.avifQuality, width));
      tasks.push(processFormat('webp', CONFIG.webpQuality, width));
    }

    if (CONFIG.generateBlur) {
      const blurPath = path.join(dirName, `${baseName}-blur.webp`);
      tasks.push(
        image.clone()
          .resize(20, null, { withoutEnlargement: true })
          .webp({ quality: 20 })
          .toFile(blurPath)
          .then(() => processedCount++)
      );
    }

    await Promise.all(tasks);
    if (processedCount > 0) {
      console.log(`✅ Optimized: ${fileInfo} -> Generated ${processedCount} variants`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${fileInfo}:`, error.message);
  }
}

async function scanDirectory(dir) {
  let filesToProcess = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        filesToProcess = filesToProcess.concat(await scanDirectory(fullPath));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        
        if (isSupportedFile(ext) && !isGeneratedFile(entry.name)) {
          filesToProcess.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to scan directory ${dir}:`, error.message);
  }

  return filesToProcess;
}

async function main() {
  console.log(`🔍 Scanning ${CONFIG.publicDir} for images...`);
  
  const files = await scanDirectory(CONFIG.publicDir);
  console.log(`Found ${files.length} images to process.\n`);

  if (files.length === 0) return;

  let active = 0;
  let index = 0;

  return new Promise((resolve) => {
    const next = () => {
      if (index >= files.length && active === 0) {
        console.log('\n🎉 Image optimization complete!');
        resolve();
        return;
      }

      while (active < CONFIG.concurrency && index < files.length) {
        const filePath = files[index++];
        active++;
        processImage(filePath).finally(() => {
          active--;
          next();
        });
      }
    };

    next();
  });
}

// Only run main if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}
