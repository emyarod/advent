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
const calculateFuel = input => Math.max(Math.floor(input / 3) - 2, 0);
const calculateTotalFuel = input => {
  const fuel = calculateFuel(input);
  return (fuel && fuel + calculateTotalFuel(fuel)) || 0;
};

(async () => {
  const masses = await getModuleMasses();
  console.log(masses.reduce((acc, curr) => acc + calculateFuel(curr), 0)); // 3442987
  // console.log(
  //   masses.reduce((acc, curr) => {
  //     let totalFuel = 0;
  //     let fuel = calculateFuel(curr);
  //     while (fuel) {
  //       totalFuel += fuel;
  //       fuel = calculateFuel(fuel);
  //     }
  //     return acc + totalFuel;
  //   }, 0) // 5161601
  // );
  console.log(masses.reduce((acc, curr) => acc + calculateTotalFuel(curr), 0)); // 5161601
})();
