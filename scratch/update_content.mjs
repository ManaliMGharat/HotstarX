import fs from 'fs';

let content = fs.readFileSync('src/data/content.ts', 'utf8');

// Ensure import of MEDIA_CATALOG
if (!content.includes("import { MEDIA_CATALOG } from './mediaCatalog';")) {
  content = "import { MEDIA_CATALOG } from './mediaCatalog';\n" + content;
}

// Replace videoUrl fields based on id
// We will parse the file and for each item and episode, update videoUrl to MEDIA_CATALOG['...'].videoUrl
const mappings = {
  // Items
  'hx-neon-city': "MEDIA_CATALOG['hx-neon-city'].videoUrl",
  'ep-nc-101': "MEDIA_CATALOG['ep-nc-101'].videoUrl",
  'ep-nc-102': "MEDIA_CATALOG['ep-nc-102'].videoUrl",
  'ep-nc-103': "MEDIA_CATALOG['ep-nc-103'].videoUrl",

  'hx-last-monsoon': "MEDIA_CATALOG['hx-last-monsoon'].videoUrl",
  'hx-velocity': "MEDIA_CATALOG['hx-velocity'].videoUrl",

  'hx-midnight-diner': "MEDIA_CATALOG['hx-midnight-diner'].videoUrl",
  'ep-md-101': "MEDIA_CATALOG['ep-md-101'].videoUrl",
  'ep-md-102': "MEDIA_CATALOG['ep-md-102'].videoUrl",

  'hx-wild-india': "MEDIA_CATALOG['hx-wild-india'].videoUrl",

  'hx-code-red': "MEDIA_CATALOG['hx-code-red'].videoUrl",
  'ep-cr-101': "MEDIA_CATALOG['ep-cr-101'].videoUrl",
  'ep-cr-102': "MEDIA_CATALOG['ep-cr-102'].videoUrl",

  'hx-orbit-9': "MEDIA_CATALOG['hx-orbit-9'].videoUrl",
  'hx-paper-planes': "MEDIA_CATALOG['hx-paper-planes'].videoUrl",
  'hx-afterglow': "MEDIA_CATALOG['hx-afterglow'].videoUrl",
  'hx-skyline-fc': "MEDIA_CATALOG['hx-skyline-fc'].videoUrl",
  'hx-kitchen-stories': "MEDIA_CATALOG['hx-kitchen-stories'].videoUrl",

  'hx-the-archive': "MEDIA_CATALOG['hx-the-archive'].videoUrl",
  'ep-ar-101': "MEDIA_CATALOG['ep-ar-101'].videoUrl",
  'ep-ar-102': "MEDIA_CATALOG['ep-ar-102'].videoUrl",

  'hx-live-cricket-1': "MEDIA_CATALOG['hx-live-cricket-1'].videoUrl",
  'hx-live-f1-1': "MEDIA_CATALOG['hx-live-f1-1'].videoUrl",
  'hx-live-football-1': "MEDIA_CATALOG['hx-live-football-1'].videoUrl",
  'hx-upcoming-cricket-1': "MEDIA_CATALOG['hx-upcoming-cricket-1'].videoUrl",

  'hx-astro-pup': "MEDIA_CATALOG['hx-astro-pup'].videoUrl",
  'hx-little-explorers': "MEDIA_CATALOG['hx-little-explorers'].videoUrl",
  'hx-chrono-rift': "MEDIA_CATALOG['hx-chrono-rift'].videoUrl",

  'hx-shadows-mist': "MEDIA_CATALOG['hx-shadows-mist'].videoUrl",
  'ep-sm-101': "MEDIA_CATALOG['ep-sm-101'].videoUrl",
  'ep-sm-102': "MEDIA_CATALOG['ep-sm-102'].videoUrl",

  'hx-kavach': "MEDIA_CATALOG['hx-kavach'].videoUrl",
  'hx-ocean-odyssey': "MEDIA_CATALOG['hx-ocean-odyssey'].videoUrl",
  'hx-live-kabaddi-1': "MEDIA_CATALOG['hx-live-kabaddi-1'].videoUrl",
  'hx-silent-harbor': "MEDIA_CATALOG['hx-silent-harbor'].videoUrl",
  'hx-mumbai-monsoon': "MEDIA_CATALOG['hx-mumbai-monsoon'].videoUrl",
  'hx-chai-chaos': "MEDIA_CATALOG['hx-chai-chaos'].videoUrl",

  'hx-vortex-minds': "MEDIA_CATALOG['hx-vortex-minds'].videoUrl",
  'ep-vm-101': "MEDIA_CATALOG['ep-vm-101'].videoUrl",
  'ep-vm-102': "MEDIA_CATALOG['ep-vm-102'].videoUrl",

  'hx-live-tennis-1': "MEDIA_CATALOG['hx-live-tennis-1'].videoUrl",
};

// Process line by line
const lines = content.split('\n');
const newLines = [];
let currentId = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
  if (idMatch) {
    currentId = idMatch[1];
  }

  const videoMatch = line.match(/^(\s*)videoUrl:\s*.*?,?$/);
  if (videoMatch && currentId && mappings[currentId]) {
    const indent = videoMatch[1];
    newLines.push(`${indent}videoUrl: ${mappings[currentId]},`);
  } else {
    newLines.push(line);
  }
}

fs.writeFileSync('src/data/content.ts', newLines.join('\n'));
console.log('Successfully updated src/data/content.ts');
