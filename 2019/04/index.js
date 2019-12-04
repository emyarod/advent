import path from 'path';
import { readFileSync } from 'fs';

const getInput = () =>
  readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8')
    .trim()
    .split('-');
const input = getInput();
const countValidPasswords = ([start, end]) => {
  let count = 0;
  for (let i = start; i <= end; i++) {
    if (`${i}`.match(/(\d)\1/u) && `${i}` === [...`${i}`].sort().join('')) {
      count++;
    }
  }
  return count;
};

console.log(countValidPasswords(input)); // 1650
