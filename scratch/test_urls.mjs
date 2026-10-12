import https from 'https';
import http from 'http';

const testUrls = [
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/face-demographics-walking.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4',
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
  'https://media.w3.org/2010/05/video/movie_300.mp4',
  'https://media.w3.org/2010/05/bunny/trailer.mp4'
];

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`${res.status} ${res.headers.get('content-type')} (${res.headers.get('content-length')} bytes) : ${url}`);
  } catch (err) {
    console.log(`ERR: ${url} -> ${err.message}`);
  }
}

for (const u of testUrls) {
  await checkUrl(u);
}
