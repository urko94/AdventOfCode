import { readInput } from '../utils/input';
import { printGrid } from '../utils/output';

const countPins = (data: string[][]): number[] => {
  const pins: number[] = [];

  for (let i = 0; i < data[0].length; i++) {
    let counter = 0;
    for (let j = 1; j < data.length - 1; j++) {
      if (data[j][i] === '#') {
        counter++;
      }
    }
    pins.push(counter);
  }

  return pins;
};

const checkKeys = (locks: number[][], keys: number[][], size = 5) => {
  let compatible = 0;
  locks.forEach(lock => {
    keys.forEach(key => {
      const sums = key.map((k, i) => k + lock[i]);
      if (sums.every(s => s <= size)) {
        compatible++;
      }
    });
  });
  return compatible;
};

export function day25(day: number, test: boolean) {
  const schematics = readInput(day, test)
    .split('\n\n')
    .map(s => s.split('\n').map(l => l.split('')));
  // schematics.forEach(s => printGrid(s));

  // Part 1
  const locks: number[][] = [];
  const keys: number[][] = [];

  schematics.forEach(s => {
    const pins = countPins(s);
    if (s[0][0] === '#') {
      locks.push(pins);
    } else {
      keys.push(pins);
    }
  });
  const res1 = checkKeys(locks, keys);

  // Part 2

  return {
    part1: res1,
    part2: 0,
  };
}
