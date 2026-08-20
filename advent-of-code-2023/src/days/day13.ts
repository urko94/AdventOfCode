import { readInput } from '../utils/input';
import { sum, transpose } from '../utils/utils';

export function parseMap(input: string, delimeter = ''): string[][] {
  return input.split('\n').map(l => l.split(delimeter).map(i => i));
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.join('') === b.join('');
}
function arraysSimilar(a: string[], b: string[], changed: boolean[]): boolean {
  if (arraysEqual(a, b)) return true;
  if (changed[0]) return false;
  if (a.length === b.length && a.filter((val, i) => val === b[i]).length === a.length - 1) {
    changed[0] = true;
    a.forEach((v, i) => {
      if (v !== b[i]) {
        a[i] = b[i];
      }
    });
    return true;
  }
  return false;
}

const findReflection = (grid: string[][]): number => {
  for (let i = 0; i < grid.length - 1; i++) {
    if (arraysEqual(grid[i], grid[i + 1])) {
      let j = 1;
      while (i - j >= 0 && i + j + 1 < grid.length && arraysEqual(grid[i - j], grid[i + j + 1])) {
        j++;
      }
      if (i - j < 0 || i + j + 1 === grid.length) {
        return i + 1;
      }
    }
  }
  return 0;
};

const findSimilarReflection = (grid: string[][]): number => {
  let changed = [false];

  for (let i = 0; i < grid.length - 1; i++) {
    if (arraysSimilar(grid[i], grid[i + 1], changed)) {
      let j = 1;
      while (i - j >= 0 && i + j + 1 < grid.length && arraysSimilar(grid[i - j], grid[i + j + 1], changed)) {
        j++;
      }
      if (i - j < 0 || i + j + 1 === grid.length) {
        return i + 1;
      }
    }
  }
  return 0;
};

const findBestReflection = (reflection: Record<number, number>, max: number = 0, i: number = 0) => {
  for (const p in reflection) {
    if (reflection[p] > max) {
      max = reflection[p];
      i = Number(p);
    }
  }
  return { max, i };
};

function diffCount(a: string, b: string): number {
  let count = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) count++;
  return count;
}
function findMirror(grid: string[], allowSmudge: boolean): number {
  for (let i = 0; i < grid.length - 1; i++) {
    let smudges = 0;
    let valid = true;

    for (let offset = 0; i - offset >= 0 && i + 1 + offset < grid.length; offset++) {
      smudges += diffCount(grid[i - offset], grid[i + 1 + offset]);
      if (smudges > (allowSmudge ? 1 : 0)) {
        valid = false;
        break;
      }
    }

    // For part 2, exactly 1 smudge must exist
    if (valid && (!allowSmudge || smudges === 1)) return i + 1;
  }
  return 0;
}

const partOne = (grid: string[][]): number => {
  const grid2 = transpose(grid);
  const reflectionRows = findReflection(grid);
  const reflectionCols = findReflection(grid2);

  return reflectionRows * 100 + reflectionCols;
};

const jointRow = (grid: string[][]) => grid.map(m => m.join(''));

const partTwo = (grid: string[][]): number => {
  const grid2 = transpose(grid);
  // const reflectionRows = findSimilarReflection(grid);
  // const reflectionCols = findSimilarReflection(grid2);

  // return reflectionRows > reflectionCols ? reflectionRows * 100 : reflectionCols;

  const horizontal = findMirror(jointRow(grid), true);
  const vertical = findMirror(jointRow(grid2), true);
  return horizontal * 100 + vertical;
};

export function day13(day: number, test: boolean) {
  const grids = readInput(day, test)
    .split('\n\n')
    .map(m => parseMap(m));

  // Part 1
  const res1 = grids.map(g => partOne(g));

  // Part 2
  const res2 = grids.map(g => partTwo(g));
  console.log(res2);

  return {
    part1: sum(res1),
    part2: sum(res2),
  };
}
