import path from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';

const readFilePromise = promisify(readFile);
const getInput = async () => {
  try {
    const data = await readFilePromise(
      path.resolve(__dirname, 'input.txt'),
      'utf8'
    );
    return data
      .trim()
      .split(',')
      .map(Number);
  } catch (err) {
    console.log('ERROR:', err);
    return null;
  }
};
const runIntcode = input => {
  for (
    let i = 0, j = i + 1, k = i + 2, l = i + 3;
    i < input.length;
    i += 4, j += 4, k += 4, l += 4
  ) {
    const opcode = input[i];
    const noun = input[j];
    const verb = input[k];
    const resultIdx = input[l];
    if (opcode === 99) {
      break;
    }
    if (opcode === 1) {
      input[resultIdx] = input[noun] + input[verb];
    }
    if (opcode === 2) {
      input[resultIdx] = input[noun] * input[verb];
    }
  }
  return input;
};

console.log(runIntcode([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50])); // 3500,9,10,70,2,3,11,0,99,30,40,50
console.log(runIntcode([1, 0, 0, 0, 99])); // 2,0,0,0,99
console.log(runIntcode([2, 3, 0, 3, 99])); // 2,3,0,6,99
console.log(runIntcode([2, 4, 4, 5, 99, 0])); // 2,4,4,5,99,9801

(async () => {
  const input = await getInput();
  input[1] = 12;
  input[2] = 2;
  console.log(runIntcode(input)[0]);
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const inputPt2 = await getInput();
      inputPt2[1] = noun;
      inputPt2[2] = verb;
      if (runIntcode(inputPt2)[0] === 19690720) {
        console.log(100 * noun + verb);
        return;
      }
    }
  }
})();
