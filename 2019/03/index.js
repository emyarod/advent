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
      .split('\n')
      .map(line => line.split(','));
  } catch (err) {
    console.log('ERROR:', err);
    return null;
  }
};
const addWirePositions = ({ direction, magnitude, wirePositions, x, y }) => {
  for (let i = 0; i <= magnitude; i++) {
    if (direction === 'U') {
      wirePositions.set(`${x},${y + i}`, true);
    } else if (direction === 'R') {
      wirePositions.set(`${x + i},${y}`, true);
    } else if (direction === 'D') {
      wirePositions.set(`${x},${y - i}`, true);
    } else if (direction === 'L') {
      wirePositions.set(`${x - i},${y}`, true);
    }
  }
  return wirePositions;
};
const getWirePositions = wire => {
  let wirePositions = new Map();
  let x = 0;
  let y = 0;
  for (let i = 0; i < wire.length; i++) {
    const [direction] = wire[i];
    const magnitude = Number(wire[i].slice(1));
    wirePositions = new Map([
      ...wirePositions,
      ...addWirePositions({ direction, magnitude, wirePositions, x, y }),
    ]);
    if (direction === 'U') {
      y += magnitude;
    } else if (direction === 'R') {
      x += magnitude;
    } else if (direction === 'D') {
      y -= magnitude;
    } else if (direction === 'L') {
      x -= magnitude;
    }
  }
  return wirePositions;
};
const findIntersections = ({ map1, map2 }) => {
  const intersections = new Set();
  map1.forEach((_, key) => {
    if (map2.has(key) && key !== '0,0') {
      intersections.add(key);
    }
  });
  return intersections;
};
const calcManhattanDistance = (x1, y1, x2, y2) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);
const findClosestIntersection = ({ wire1, wire2 }) => {
  const wire1Positions = getWirePositions(wire1);
  const wire2Positions = getWirePositions(wire2);
  const intersections = findIntersections({
    map1: wire1Positions,
    map2: wire2Positions,
  });
  return Math.min(
    ...[...intersections].map(value =>
      calcManhattanDistance(0, 0, ...value.split(','))
    )
  );
};
console.log(
  findClosestIntersection({
    wire1: 'R75,D30,R83,U83,L12,D49,R71,U7,L72'.split(','),
    wire2: 'U62,R66,U55,R34,D71,R55,D58,R83'.split(','),
  })
); // 159
console.log(
  findClosestIntersection({
    wire1: 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'.split(','),
    wire2: 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'.split(','),
  })
); // 135
(async () => {
  const input = await getInput();
  const [wire1, wire2] = input;
  console.log(findClosestIntersection({ wire1, wire2 }));
})();
