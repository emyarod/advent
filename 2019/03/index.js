import path from 'path';
import { readFileSync } from 'fs';

const getInput = () =>
  readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8')
    .trim()
    .split('\n')
    .map(wire =>
      wire.split(',').map(move => ({
        direction: move[0],
        magnitude: Number(move.slice(1)),
      }))
    );
const DIRECTIONS = {
  U: { x: 0, y: 1 },
  R: { x: 1, y: 0 },
  D: { x: 0, y: -1 },
  L: { x: -1, y: 0 },
};
const getPoints = wire => {
  const currentPosition = { x: 0, y: 0 };
  return wire.reduce((acc, { direction, magnitude }) => {
    for (let j = 0; j < magnitude; j++) {
      const { x, y } = DIRECTIONS[direction];
      currentPosition.x += x;
      currentPosition.y += y;
      acc.push(`${currentPosition.x},${currentPosition.y}`);
    }
    return acc;
  }, []);
};
const getIntersections = wires => {
  const sets = wires.map(w => new Set(w));
  return wires[0]
    .filter(value => sets.every(w => w.has(value)))
    .map(key => [key.split(',').map(Number)].map(([x, y]) => ({ x, y }))[0]);
};
const calcManhattanDistance = (
  { x: x1, y: y1 },
  { x: x2, y: y2 } = { x: 0, y: 0 }
) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
const findClosestIntersection = wires => {
  const points = wires.map(getPoints);
  return Math.min(
    ...getIntersections(points).map(point => calcManhattanDistance(point))
  );
};

const calcSteps = (wire, point) => wire.indexOf(`${point.x},${point.y}`) + 1;
const findMinStepsToIntersection = wires => {
  const points = wires.map(getPoints);
  return Math.min(
    ...getIntersections(points).map(point =>
      points.reduce((acc, wire) => acc + calcSteps(wire, point), 0)
    )
  );
};

console.log(
  findClosestIntersection(
    `U5,R10
R10,U20,L8,D18`
      .trim()
      .split('\n')
      .map(wire =>
        wire.split(',').map(move => ({
          direction: move[0],
          magnitude: Number(move.slice(1)),
        }))
      )
  )
); // 7
console.log(
  findMinStepsToIntersection(
    `U5,R10
R10,U20,L8,D18`
      .trim()
      .split('\n')
      .map(wire =>
        wire.split(',').map(cmd => ({
          direction: cmd[0],
          magnitude: Number(cmd.slice(1)),
        }))
      )
  )
); // 30

console.log(
  findClosestIntersection(
    `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`
      .trim()
      .split('\n')
      .map(wire =>
        wire.split(',').map(cmd => ({
          direction: cmd[0],
          magnitude: Number(cmd.slice(1)),
        }))
      )
  )
); // 159
console.log(
  findClosestIntersection(
    `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`
      .trim()
      .split('\n')
      .map(wire =>
        wire.split(',').map(cmd => ({
          direction: cmd[0],
          magnitude: Number(cmd.slice(1)),
        }))
      )
  )
); // 135
console.log(
  findMinStepsToIntersection(
    `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`
      .trim()
      .split('\n')
      .map(wire =>
        wire.split(',').map(cmd => ({
          direction: cmd[0],
          magnitude: Number(cmd.slice(1)),
        }))
      )
  )
); // 610
console.log(
  findMinStepsToIntersection(
    `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`
      .trim()
      .split('\n')
      .map(wire =>
        wire.split(',').map(cmd => ({
          direction: cmd[0],
          magnitude: Number(cmd.slice(1)),
        }))
      )
  )
); // 410

const input = getInput();
console.log(findClosestIntersection(input)); // 768
console.log(findMinStepsToIntersection(input)); // 8684
