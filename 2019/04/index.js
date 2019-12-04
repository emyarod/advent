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
const countValidPasswords2 = ([start, end]) => {
  let count = 0;
  for (let i = start; i <= end; i++) {
    if (
      `${i}`.match(/(\d)\1/u) &&
      `${i}` === [...`${i}`].sort().join('') &&
      `${i}`
        .replace(/((\d)\2*)/gu, '$1,')
        .split(',')
        .some(str => str.length === 2)
    ) {
      count++;
    }
  }
  return count;
};

console.log(countValidPasswords(input)); // 1650
console.log(countValidPasswords2(input)); // 1129
