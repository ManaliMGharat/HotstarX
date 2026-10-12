import fs from 'fs';

const content = fs.readFileSync('src/data/content.ts', 'utf8');

// Match items by id
const itemMatches = [...content.matchAll(/id:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"]/g)];
console.log(`Found ${itemMatches.length} items`);

// Extract all id, title, category, videoUrl
const lines = content.split('\n');
let currentItem = null;
const items = [];

for (const line of lines) {
  const idMatch = line.match(/^\s*id:\s*['"]([^'"]+)['"]/);
  const titleMatch = line.match(/^\s*title:\s*['"]([^'"]+)['"]/);
  const categoryMatch = line.match(/^\s*category:\s*['"]([^'"]+)['"]/);
  const videoMatch = line.match(/^\s*videoUrl:\s*['"]([^'"]+)['"]/);
  const sportMatch = line.match(/^\s*sport:\s*['"]([^'"]+)['"]/);

  if (idMatch) {
    if (idMatch[1].startsWith('ep-')) {
      // episode
    } else {
      currentItem = { id: idMatch[1], title: '', category: '', videoUrl: '', sport: '' };
      items.push(currentItem);
    }
  }
  if (currentItem) {
    if (titleMatch && !currentItem.title) currentItem.title = titleMatch[1];
    if (categoryMatch && !currentItem.category) currentItem.category = categoryMatch[1];
    if (videoMatch && !currentItem.videoUrl) currentItem.videoUrl = videoMatch[1];
    if (sportMatch && !currentItem.sport) currentItem.sport = sportMatch[1];
  }
}

console.log(JSON.stringify(items, null, 2));
