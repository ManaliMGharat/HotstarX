import fs from 'fs';
import path from 'path';

const assetsToDownload = [
  {
    name: 'cricket-match-demo.webm',
    url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/80/This_is_cricket.ogv/This_is_cricket.ogv.240p.vp9.webm',
    description: 'Cricket match batting, bowling and fielding'
  },
  {
    name: 'cricket-t20-demo.webm',
    url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/53/ABC_World_Series_Cricket.ogv/ABC_World_Series_Cricket.ogv.240p.vp9.webm',
    description: 'T20 & World Series Cricket match action'
  },
  {
    name: 'football-match-demo.webm',
    url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/b/b2/2018_FIFA_U-17_Women%27s_World_Cup_-_New_Zealand_vs_Canada_-_21.webm/2018_FIFA_U-17_Women%27s_World_Cup_-_New_Zealand_vs_Canada_-_21.webm.360p.vp9.webm',
    description: 'FIFA competitive football match'
  },
  {
    name: 'tennis-match-demo.webm',
    url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/50/2018_Davis_Cup_Americas_Zone_-_Uruguay_vs_Mexico_-_03.webm/2018_Davis_Cup_Americas_Zone_-_Uruguay_vs_Mexico_-_03.webm.360p.vp9.webm',
    description: 'Davis Cup tennis championship match'
  },
  {
    name: 'kabaddi-match-demo.webm',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Kabaddi-japan-2015-10-4.webm',
    description: 'Kabaddi league championship match action'
  },
  {
    name: 'space-exploration-demo.webm',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/EPIC_View_of_Moon_Transiting_the_Earth.webm',
    description: 'NASA deep space exploration of Moon and Earth'
  },
  {
    name: 'culinary-recipe-demo.webm',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Cooking_Squilla_mantis_with_tomato_sauce.webm',
    description: 'Gourmet cooking and recipe preparation'
  }
];

const destDir = path.resolve('public/videos');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function downloadFile(item) {
  const destPath = path.join(destDir, item.name);
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100000) {
    console.log(`[ALREADY EXISTS] ${item.name} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);
    return;
  }

  console.log(`[DOWNLOADING] ${item.name} from ${item.url}...`);
  const res = await fetch(item.url, {
    headers: {
      'User-Agent': 'HotstarXMediaCatalog/1.0 (contact@hotstarx.local; educational project)'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to download ${item.name}: HTTP ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
  console.log(`[COMPLETED] ${item.name}: ${(arrayBuffer.byteLength / 1024).toFixed(1)} KB saved.`);
}

async function main() {
  for (const item of assetsToDownload) {
    try {
      await downloadFile(item);
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err.message);
    }
  }
  console.log('Finished downloading all media assets.');
}

main();
