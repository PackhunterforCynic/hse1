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
        
        // Skip if already migrated (has chapters array)
        if (data.chapters) {
          console.log(`Skipping ${projectSlug}, already migrated.`);
          return;
        }

        const images = data.media?.filter(m => m.type === 'image') || [];
        const videos = data.media?.filter(m => m.type === 'video') || [];
        
        // Try to group by folder name
        const chaptersMap = {};
        
        images.forEach(img => {
          // e.g. /images/naveen sharlien/Church/001.jpg
          const parts = img.src.split('/');
          let chapterName = "Gallery"; // Default
          if (parts.length >= 5) {
            // parts[0] = '', parts[1] = 'images', parts[2] = 'project-name', parts[3] = 'folder'
            // If the folder is a direct image file, it might not have a chapter folder.
            const possibleChapter = parts[parts.length - 2];
            // Make sure it's not the project folder itself
            if (possibleChapter.toLowerCase() !== projectSlug.toLowerCase() && possibleChapter !== parts[2]) {
              // Clean up chapter name (e.g., "Haldi_Ceremony" -> "Haldi Ceremony")
              chapterName = possibleChapter.replace(/_/g, ' ');
            }
          }
          
          if (!chaptersMap[chapterName]) {
            chaptersMap[chapterName] = { title: chapterName, description: "", images: [] };
          }
          chaptersMap[chapterName].images.push(img.src);
        });

        const chapters = Object.values(chaptersMap);

        const newData = {
          title: data.title || projectSlug,
          cover: data.heroImage || "",
          location: "Unknown Location", // Placeholder
          year: new Date().getFullYear().toString(),
          client: data.credits?.client || "",
          category: "Photography", // Will be overridden by projects.js anyway
          services: data.deliverables || [],
          featured: data.featured || images.slice(0, 6).map(m => m.src),
          story: data.story || "",
          heroVideo: data.heroVideo || "",
          videos: videos.map(v => v.src), // Keep track of videos separately if needed
          chapters: chapters,
          bts: [] // Empty array for behind the scenes
        };

        fs.writeFileSync(galleryPath, JSON.stringify(newData, null, 2), 'utf8');
        console.log(`Successfully migrated ${projectSlug} with ${chapters.length} chapters.`);
      } catch (err) {
        console.error(`Error processing ${galleryPath}:`, err);
      }
    }
  }
});
