import { readFile } from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFilePromise = promisify(readFile);

const getFrequencyChanges = async () => {
  try {
    const data = await readFilePromise(
      path.resolve(__dirname, 'input.txt'),
      'utf8'
    );
    return data
      .trim()
      .split('\n')
      .map(Number);
  } catch (err) {
    console.log('ERROR:', err);
    return null;
  }
};

const resultingFrequency = changes =>
  changes ? changes.reduce((acc, curr) => acc + curr, 0) : null;

const getRepeatFrequency = changes => {
  if (!changes) {
    return;
  }
  let frequency = 0;
  const frequencies = new Set([frequency]);
  while (true) {
    for (let i = 0; i < changes.length; i++) {
      frequency += changes[i];
      if (frequencies.has(frequency)) {
        return frequency;
      }
      frequencies.add(frequency);
    }
  }
};

(async () => {
  const changes = await getFrequencyChanges();
  console.log(resultingFrequency(changes)); // 411
  console.log(getRepeatFrequency(changes));
  console.log(getRepeatFrequency([1, -2, 3, 1])); // 2
  console.log(getRepeatFrequency([1, -1])); // 0
  console.log(getRepeatFrequency([3, 3, 4, -2, -4])); // 10
  console.log(getRepeatFrequency([-6, 3, 8, 5, -6])); // 5
  console.log(getRepeatFrequency([7, 7, -2, -7, -4])); // 14
  console.log(getRepeatFrequency([1, 1, 10, -9])); // 12
})();
