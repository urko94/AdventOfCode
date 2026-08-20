import { readMap } from '../utils/input';
import { printGrid, printLines } from '../utils/output';

type Position = [number, number];

const hasPosition = (data: Position[], x: number, y: number) => data.some(p => p[0] === x && p[1] === y);

const findPath = (
  grid: number[][],
  x: number,
  y: number,
  step = 0,
  unique: boolean,
  results: Position[] = []
): Position[] => {
  if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length || grid[x][y] != step) return results;

  if (grid[x][y] === 9 || step === 9) {
    if (!unique) {
      results.push([x, y]);
    } else if (!hasPosition(results, x, y)) {
      results.push([x, y]);
    }
    return results;
  }

  results = findPath(grid, x - 1, y, step + 1, unique, results);
  results = findPath(grid, x + 1, y, step + 1, unique, results);
  results = findPath(grid, x, y - 1, step + 1, unique, results);
  return findPath(grid, x, y + 1, step + 1, unique, results);
};

const partOne = (grid: number[][], uniquePath = false) => {
  const results = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 0) {
        const res = findPath(grid, i, j, 0, uniquePath);
        if (res) {
          results.push(res);
        }
      }
    }
  }
  return results.flat();
};

export function day10() {
  const grid = readMap(10, false, '');
  // printGrid(grid);

  // Part 1
  const res1 = partOne(grid, true);

  //Part 2
  const res2 = partOne(grid);

  return {
    part1: res1.length,
    part2: res2.length,
  };
}
