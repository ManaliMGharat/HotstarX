import fs from 'fs';

const buf = fs.readFileSync('public/sample-video.mp4');
// search for readable ASCII strings
const str = buf.toString('latin1');
const matches = str.match(/[\x20-\x7E]{6,}/g) || [];
console.log('Strings in sample-video.mp4:', matches.slice(0, 30));
