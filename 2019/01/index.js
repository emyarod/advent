import path from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';

const readFilePromise = promisify(readFile);
const getModuleMasses = async () => {
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

(async () => {
  const masses = await getModuleMasses();
  console.log(
    masses.reduce((acc, curr) => acc + (Math.floor(curr / 3) - 2), 0)
  );
})();
