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
const getCorrectBoxIdCommonLetters = boxIds => {
  let index = 0;
  for (let i = 0; i < boxIds.length - 1; i++) {
    for (let j = i + 1; j < boxIds.length; j++) {
      const [currentId, nextId] = [boxIds[i], boxIds[j]];
      let inaccuracies = 0;
      let commonLetters = '';
      for (let k = 0; k < currentId.length; k++) {
        if (currentId[k] !== nextId[k]) {
          inaccuracies++;
          index = k;
        } else {
          commonLetters += currentId[k];
        }
        if (inaccuracies > 1) {
          commonLetters = '';
          break;
        }
      }
      if (inaccuracies === 1) {
        return commonLetters;
      }
    }
  }
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
  console.log(getCorrectBoxIdCommonLetters(boxIds)); // megsdlpulxvinkatfoyzxcbvq
  console.log(
    getCorrectBoxIdCommonLetters([
      'abcde',
      'fghij',
      'klmno',
      'pqrst',
      'fguij',
      'axcye',
      'wvxyz',
    ])
  ); // fgij
})();
