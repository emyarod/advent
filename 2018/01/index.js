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
    return data.split('\n').map(Number);
  } catch (err) {
    console.log('ERROR:', err);
    return null;
  }
};

const resultingFrequency = async () => {
  const changes = await getFrequencyChanges();
  return changes ? changes.reduce((acc, curr) => acc + curr, 0) : null;
};

(async () => {
  console.log(await resultingFrequency()); // 411
})();
