import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, 'public', 'images');
const manifestPath = path.join(__dirname, 'src', 'data', 'imageManifest.json');

const TARGET_WIDTHS = [480, 768, 1280, 1920];
const CONCURRENCY_LIMIT = 6;

// Pattern to ignore already generated files
const ignoredPattern = /(-\d{3,4}\.(avif|webp|jpg|jpeg|png)$)|(-blur\.webp)$/i;

// Simple Concurrency Queue
async function runWithConcurrency(tasks, limit) {
  const results = [];
  const executing = [];
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    if (limit <= tasks.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

function getImagesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getImagesRecursively(fullPath));
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext) && !ignoredPattern.test(file)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

async function processImage(fullPath, manifest) {
  const dir = path.dirname(fullPath);
  const ext = path.extname(fullPath);
  const baseName = path.basename(fullPath, ext);
  
  // Create relative path key for manifest (e.g. "/images/hero.jpg")
  const relativePath = '/' + path.relative(path.join(__dirname, 'public'), fullPath).split(path.sep).join('/');
  const jsonPath = path.join(dir, `${baseName}.json`);
  
  const stat = fs.statSync(fullPath);
  
  // Smart Caching: check if we already processed this exact file modification time
  let existingMeta = null;
  if (fs.existsSync(jsonPath)) {
    try {
      existingMeta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (existingMeta.mtime === stat.mtimeMs) {
        // Unchanged! Update manifest and skip
        manifest[relativePath] = existingMeta;
        return;
      }
    } catch (e) {
      // JSON corrupt or unreadable, process normally
    }
  }

  console.log(`Processing: ${relativePath}`);
  
  const pipeline = sharp(fullPath).rotate(); // Preserve EXIF orientation
  const metadata = await pipeline.metadata();
  
  const originalWidth = metadata.width;
  const originalHeight = metadata.height;
  
  const generatedWidths = [];
  
  // 1. Generate Responsive WebP (Removed AVIF due to extreme processing time)
  for (const width of TARGET_WIDTHS) {
    if (originalWidth >= width) {
      generatedWidths.push(width);
        
      const webpPath = path.join(dir, `${baseName}-${width}.webp`);
      await pipeline.clone()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(webpPath);
    }
  }
  
  // 2. Progressive JPEG Fallback
  // If original is already jpg/jpeg, we overwrite or create a sibling if original was webp/png
  const jpegFallbackPath = path.join(dir, `${baseName}-fallback.jpg`);
  await pipeline.clone()
    .jpeg({ quality: 82, progressive: true })
    .toFile(jpegFallbackPath);
    
  // 3. Blur Placeholder
  const blurPath = path.join(dir, `${baseName}-blur.webp`);
  await pipeline.clone()
    .resize({ width: 20 }) // Tiny width
    .webp({ quality: 20 })
    .toFile(blurPath);
    
  // 4. Save Metadata
  const meta = {
    mtime: stat.mtimeMs, // for smart caching
    originalWidth,
    originalHeight,
    placeholder: relativePath.replace(ext, '-blur.webp'),
    fallback: relativePath.replace(ext, '-fallback.jpg'),
    widths: generatedWidths,
    baseName: path.basename(relativePath, ext),
    dir: path.dirname(relativePath)
  };
  
  fs.writeFileSync(jsonPath, JSON.stringify(meta, null, 2));
  manifest[relativePath] = meta;
}

async function run() {
  console.log('Scanning for images...');
  const allImages = getImagesRecursively(targetDir);
  console.log(`Found ${allImages.length} source images.`);
  
  const manifest = {};
  
  let processedCount = 0;
  
  const tasks = allImages.map(img => async () => {
    try {
      await processImage(img, manifest);
      processedCount++;
      if (processedCount % 10 === 0) {
        console.log(`Progress: ${processedCount} / ${allImages.length}`);
      }
    } catch (err) {
      console.error(`Error processing ${img}: ${err.message}`);
    }
  });

  console.log('Starting parallel processing pipeline...');
  await runWithConcurrency(tasks, CONCURRENCY_LIMIT);
  
  // Save Manifest
  const manifestDir = path.dirname(manifestPath);
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }
  
  // Remove the mtime from manifest before saving to client bundle to save space
  const cleanManifest = {};
  for (const [key, val] of Object.entries(manifest)) {
    const { mtime, ...cleanVal } = val;
    cleanManifest[key] = cleanVal;
  }
  
  fs.writeFileSync(manifestPath, JSON.stringify(cleanManifest, null, 2));
  console.log('✅ Pipeline Complete! Manifest saved to src/data/imageManifest.json');
}

run().catch(err => {
  console.error('Pipeline crashed:', err);
  process.exit(1);
});
