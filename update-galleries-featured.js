const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'public', 'content');

fs.readdirSync(contentDir).forEach(projectSlug => {
  const projectDir = path.join(contentDir, projectSlug);
  if (fs.statSync(projectDir).isDirectory()) {
    const galleryPath = path.join(projectDir, 'gallery.json');
    if (fs.existsSync(galleryPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(galleryPath, 'utf8'));
        
        if (!data.featured) {
          // Find first 6 images to feature
          const images = data.media.filter(m => m.type === 'image').map(m => m.src);
          data.featured = images.slice(0, 6);
          
          fs.writeFileSync(galleryPath, JSON.stringify(data, null, 2), 'utf8');
          console.log(`Updated ${galleryPath} with ${data.featured.length} featured images.`);
        } else {
          console.log(`${galleryPath} already has featured images.`);
        }
      } catch (err) {
        console.error(`Error processing ${galleryPath}:`, err);
      }
    }
  }
});
