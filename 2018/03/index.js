import { readFile } from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFilePromise = promisify(readFile);
const getClaims = async () => {
  try {
    const data = await readFilePromise(
      path.resolve(__dirname, 'input.txt'),
      'utf8'
    );
    return data.trim().split('\n');
  } catch (err) {
    console.log('ERROR:', err);
    return null;
  }
};
const getOverlapArea = claims => {
  const diagram = new Map();
  claims.forEach(claim => {
    const [, coordinates, area] = claim.match(/(#\d*)|(\d*,\d*)|(\d*x\d*)/g);
    const [x, y] = coordinates.split(',').map(Number);
    const [width, height] = area.split('x').map(Number);
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        diagram.set(`${i},${j}`, (diagram.get(`${i},${j}`) || 0) + 1);
      }
    }
  });
  return [...diagram.values()].filter(v => v > 1).length;
};
const getUniqueClaim = claims => {
  const diagram = new Map();
  const overlaps = new Map();
  claims.forEach(claim => {
    const [id, coordinates, area] = claim.match(/(#\d*)|(\d*,\d*)|(\d*x\d*)/g);
    const [x, y] = coordinates.split(',').map(Number);
    const [width, height] = area.split('x').map(Number);
    overlaps.set(id, true);
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        if (diagram.get(`${i},${j}`)) {
          overlaps.set(diagram.get(`${i},${j}`), false);
          overlaps.set(id, false);
        }
        diagram.set(`${i},${j}`, id);
      }
    }
  });
  return [...overlaps.entries()]
    .filter(([, overlap]) => overlap)[0][0]
    .slice(1);
};

(async () => {
  const claims = await getClaims();
  console.log(getOverlapArea(claims)); // 120408
  console.log(
    getOverlapArea(['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'])
  ); // 4
  console.log(getUniqueClaim(claims)); // 1276
  console.log(
    getUniqueClaim(['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'])
  ); // 3
})();
