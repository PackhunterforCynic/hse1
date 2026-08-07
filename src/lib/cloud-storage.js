import fs from 'node:fs';
import path from 'node:path';

// Helper for local JSON file resolution in server/data/
function getLocalPath(archiveKey) {
  const fileNames = {
    contacts: 'contact-leads.json',
    internships: 'internships-archive.json',
    chats: 'chats-history.json'
  };
  const fileName = fileNames[archiveKey] || `${archiveKey}.json`;
  return path.join(process.cwd(), 'server', 'data', fileName);
}

// Read JSON file directly from filesystem
export async function getArchive(archiveKey, defaultData = {}) {
  try {
    const filePath = getLocalPath(archiveKey);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn(`[JSON Storage] Failed reading ${archiveKey}:`, err.message);
  }
  
  // If file doesn't exist yet, save default data and return it
  await saveArchive(archiveKey, defaultData);
  return defaultData;
}

// Save JSON data directly to local disk in server/data/
export async function saveArchive(archiveKey, data) {
  try {
    const dataDir = path.join(process.cwd(), 'server', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = getLocalPath(archiveKey);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`[JSON Storage] Successfully saved data to ${filePath}`);
    return true;
  } catch (err) {
    console.error(`[JSON Storage Error] Failed saving ${archiveKey}:`, err.message);
    return false;
  }
}

// Resets archive to default data in local JSON storage
export async function resetArchive(archiveKey, defaultData = {}) {
  await saveArchive(archiveKey, defaultData);
}
