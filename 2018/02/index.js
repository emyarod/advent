import { readFile } from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFilePromise = promisify(readFile);
const getBoxIds = async () => {
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
const getChecksum = boxIds => {
  const checksumMap = new Map();
  let [totalTwos, totalThrees] = [0, 0];
  boxIds.forEach(boxId => {
    const letters = new Map();
    [...boxId].forEach(letter => {
      const currentLetterCount = letters.get(letter);
      letters.set(letter, letters.has(letter) ? currentLetterCount + 1 : 1);
    });
    const twos = [...letters.keys()].filter(key => letters.get(key) === 2);
    const threes = [...letters.keys()].filter(key => letters.get(key) === 3);
    totalTwos += twos.length ? 1 : 0;
    totalThrees += threes.length ? 1 : 0;
    checksumMap.set(letters);
  });
  return totalTwos * totalThrees;
};

(async () => {
  const boxIds = await getBoxIds();
  console.log(getChecksum(boxIds)); // 5456
  console.log(
    getChecksum([
      'abcdef',
      'bababc',
      'abbcde',
      'abcccd',
      'aabcdd',
      'abcdee',
      'ababab',
    ])
  ); // 12
})();
