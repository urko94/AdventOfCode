import { readMap } from '../utils/input';
import { printGrid } from '../utils/output';
import { matrixToString, rotateMatrix, sum, transpose } from '../utils/utils';

enum Rock {
  ROUNDED = 'O',
  CUBE = '#',
  EMPTY = '.',
}
const CYCLES = 1000000000;

const orderLine = (line: string[]) => {
  let emptyIdx = 0;

  for (let i = 1; i < line.length; i++) {
    if (line[i] === Rock.CUBE) {
      emptyIdx = i + 1;
    }
    while (line[emptyIdx] !== Rock.EMPTY && emptyIdx < i) {
      emptyIdx++;
    }
    if (line[i] === Rock.ROUNDED && line[emptyIdx] === Rock.EMPTY) {
      line[emptyIdx] = Rock.ROUNDED;
      line[i] = Rock.EMPTY;
      emptyIdx++;
    }
  }
};

const sumLine = (line: string[], idx: number) => {
  return line.filter(l => l === Rock.ROUNDED).length * idx;
};

const partOne = (grid: string[][]) => {
  const gridT = transpose(grid);

  gridT.forEach(line => orderLine(line));
  const girdR = transpose(gridT);
  return girdR.map((l, i) => sumLine(l, girdR.length - i));
};

const partTwo = (grid: string[][]) => {
  const memo = new Map<string, number[]>();
  let gridT = transpose(grid);

  for (let cycle = 1; cycle <= CYCLES; cycle++) {
    for (let i = 0; i < 4; i++) {
      gridT.forEach(line => orderLine(line));
      gridT = rotateMatrix(gridT, 'ccw');
    }
    const key = matrixToString(gridT);
    if (memo.has(key)) {
      const intervals = memo.get(key) || [];
      intervals.push(cycle);

      if (intervals.length > 2) {
        const diff = intervals[intervals.length - 1] - intervals[intervals.length - 2];
        let startDiff = intervals[1];
        while (startDiff > diff) {
          startDiff -= diff;
        }
        if (diff * Math.floor(CYCLES / diff) + startDiff === CYCLES) {
          break;
        }
      }
    } else {
      memo.set(key, [cycle]);
    }
  }
  console.log('keys', Object.keys(memo).length);
  const gridR = transpose(gridT);
  return gridR.map((l, i) => sumLine(l, gridR.length - i));
};

export function day14(day: number, test: boolean) {
  const grid = readMap(day, test);
  // printGrid(grid);

  // Part 1
  console.time();
  const res1 = partOne(grid);
  console.timeEnd();

  // Part 2
  console.time();
  const res2 = partTwo(grid);
  console.timeEnd();

  return {
    part1: sum(res1),
    part2: sum(res2),
  };
}
