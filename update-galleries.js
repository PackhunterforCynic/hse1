import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestPath = path.join(__dirname, 'src/data/imageManifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const projectsToUpdate = {
  'indo-korean': 'indo korean',
  'naveen-sharlien': 'naveen sharlien',
  'srusti-pratik-haldi': 'srusti pratik'
};

for (const [projectId, folderName] of Object.entries(projectsToUpdate)) {
  const galleryPath = path.join(__dirname, 'public/content', projectId, 'gallery.json');
  
  if (!fs.existsSync(galleryPath)) {
    console.log(`❌ Skipped ${projectId}: gallery.json does not exist.`);
    continue;
  }
  
  const galleryData = JSON.parse(fs.readFileSync(galleryPath, 'utf8'));
  
  // Keep existing videos
  const newMedia = galleryData.media ? galleryData.media.filter(m => m.type === 'video') : [];
  
  // Find all images for this project in the manifest
  // We only want the main webp files, not the -fallback.jpg ones from the keys
  const imageKeys = Object.keys(manifest).filter(key => {
    return key.startsWith(`/images/${folderName}/`) && !key.includes('-fallback.jpg') && !key.includes('-blur.webp');
  });
  
  // Sort them so they appear in sequential order (001, 002, etc.)
  imageKeys.sort();
  
  console.log(`Found ${imageKeys.length} images for ${projectId}`);
  
  // Append to media array
  for (const key of imageKeys) {
    newMedia.push({
      type: "image",
      src: key
    });
  }
  
  galleryData.media = newMedia;
  
  fs.writeFileSync(galleryPath, JSON.stringify(galleryData, null, 2));
  console.log(`✅ Updated ${projectId}/gallery.json successfully!`);
}
