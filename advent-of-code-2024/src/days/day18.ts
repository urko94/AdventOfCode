import { Direction } from '../types';
import { readInputLines } from '../utils/input';
import { printMap } from '../utils/output';
import { createGrid } from '../utils/utils';

const findPath = (grid: number[][], y: number, x: number, step = 0, d = Direction.DOWN): number => {
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length || grid[y][x] === -1) return Number.MAX_SAFE_INTEGER;
  if (grid[y][x] > 0 && step >= grid[y][x]) return Number.MAX_SAFE_INTEGER;

  if (y > 0 || x > 0) grid[y][x] = step;

  if (y === grid.length - 1 && x === grid[0].length - 1) return step;

  const result = grid[grid.length - 1][grid[0].length - 1];
  if (result > 0 && step >= result) return Number.MAX_SAFE_INTEGER;

  const res1 = d === Direction.UP ? Number.MAX_SAFE_INTEGER : findPath(grid, y + 1, x, step + 1, Direction.DOWN);
  const res2 = d === Direction.LEFT ? Number.MAX_SAFE_INTEGER : findPath(grid, y, x + 1, step + 1, Direction.RIGHT);
  const res3 = d === Direction.DOWN ? Number.MAX_SAFE_INTEGER : findPath(grid, y - 1, x, step + 1, Direction.UP);
  const res4 = d === Direction.RIGHT ? Number.MAX_SAFE_INTEGER : findPath(grid, y, x - 1, step + 1, Direction.LEFT);

  return Math.min(res1, res2, res3, res4);
};
// Optimized recursive pathfinding with memoization and no grid mutation
const findPathMemo = (
  grid: number[][],
  y: number,
  x: number,
  step = 0,
  d = Direction.DOWN,
  memo = new Map<string, number>()
): number => {
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length || grid[y][x] === -1) return Number.MAX_SAFE_INTEGER;

  if (y === grid.length - 1 && x === grid[0].length - 1) return step;

  const key = `${y},${x},${d}`;
  if (memo.has(key) && memo.get(key)! <= step) return Number.MAX_SAFE_INTEGER;
  memo.set(key, step);

  const res1 =
    d === Direction.UP ? Number.MAX_SAFE_INTEGER : findPathMemo(grid, y + 1, x, step + 1, Direction.DOWN, memo);
  const res2 =
    d === Direction.LEFT ? Number.MAX_SAFE_INTEGER : findPathMemo(grid, y, x + 1, step + 1, Direction.RIGHT, memo);
  const res3 =
    d === Direction.DOWN ? Number.MAX_SAFE_INTEGER : findPathMemo(grid, y - 1, x, step + 1, Direction.UP, memo);
  const res4 =
    d === Direction.RIGHT ? Number.MAX_SAFE_INTEGER : findPathMemo(grid, y, x - 1, step + 1, Direction.LEFT, memo);

  return Math.min(res1, res2, res3, res4);
};

// Non-recursive (BFS) version of findPath
const findPathIterative = (grid: number[][], startY: number, startX: number): number => {
  const queue: Array<{ y: number; x: number; step: number; d: Direction }> = [];
  const visited = new Map<string, number>();
  queue.push({ y: startY, x: startX, step: 0, d: Direction.DOWN });
  const key = (y: number, x: number) => `${y},${x}`;

  while (queue.length > 0) {
    const { y, x, step, d } = queue.shift()!;

    if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length || grid[y][x] === -1) continue;
    if (grid[y][x] > 0 && step > grid[y][x]) continue;

    if (y > 0 || x > 0) grid[y][x] = step;

    if (y === grid.length - 1 && x === grid[0].length - 1) return step;

    const result = grid[grid.length - 1][grid[0].length - 1];
    if (result > 0 && step >= result) continue;

    const nextSteps: Array<{ y: number; x: number; d: Direction }> = [];
    if (d === Direction.DOWN) {
      nextSteps.push(
        { y: y + 1, x, d: Direction.DOWN },
        { y, x: x + 1, d: Direction.RIGHT },
        { y, x: x - 1, d: Direction.LEFT }
      );
    } else if (d === Direction.RIGHT) {
      nextSteps.push(
        { y, x: x + 1, d: Direction.RIGHT },
        { y: y + 1, x, d: Direction.DOWN },
        { y: y - 1, x, d: Direction.UP }
      );
    } else if (d === Direction.LEFT) {
      nextSteps.push(
        { y, x: x - 1, d: Direction.LEFT },
        { y: y + 1, x, d: Direction.DOWN },
        { y: y - 1, x, d: Direction.UP }
      );
    } else {
      nextSteps.push(
        { y: y - 1, x, d: Direction.UP },
        { y, x: x + 1, d: Direction.RIGHT },
        { y, x: x - 1, d: Direction.LEFT }
      );
    }

    for (const next of nextSteps) {
      const k = key(next.y, next.x);
      if (!visited.has(k) || visited.get(k)! > step + 1) {
        visited.set(k, step + 1);
        queue.push({ y: next.y, x: next.x, step: step + 1, d: next.d });
      }
    }
  }
  return Number.MAX_SAFE_INTEGER;
};

export function day18(day: number, test: boolean) {
  let gridSize = test ? 7 : 71;
  let numOfBytes = test ? 12 : 1024;
  const map = createGrid(gridSize, gridSize);

  const locations = readInputLines(day, test)
    .slice(0, numOfBytes)
    .map(l => l.split(',').map(Number) as Position);
  locations.forEach(([x, y]) => (map[y][x] = -1));

  // printMap(map, 3);

  // Part 1
  console.time();
  const res1 = findPath(map, 0, 0);
  console.timeEnd();
  printMap(map, 4);

  //Part 2
  const partTwo = (numOfPositions: number): number => {
    const map2 = createGrid(gridSize, gridSize);
    const locations2 = lines.slice(0, numOfPositions).map(l => l.split(',').map(Number) as Position);
    locations2.forEach(([x, y]) => (map2[y][x] = -1));
    return findPath(map2, 0, 0);
  };

  console.time();
  const lines = readInputLines(day, test);
  let lastIndex = 0;
  let sliceBytes = Math.floor(lines.length / 2);
  for (let i = 0; i < Math.floor(Math.sqrt(lines.length)); i++) {
    const res = partTwo(sliceBytes);
    const diff = Math.round(lines.length / Math.pow(2, i + 2));
    if (res === 0 || res === Number.MAX_SAFE_INTEGER) {
      sliceBytes -= diff;
    } else {
      sliceBytes += diff;
      lastIndex = sliceBytes;
    }
    console.log(i, diff, lastIndex, res);
    if (diff === 0 || lastIndex >= lines.length) break;
  }
  console.timeEnd();

  console.log('res -3:', partTwo(lastIndex - 3), lines[lastIndex - 3]);
  console.log('res -2:', partTwo(lastIndex - 2), lines[lastIndex - 2]);
  console.log('res -1:', partTwo(lastIndex - 1), lines[lastIndex - 1]);
  console.log('res 0:', partTwo(lastIndex), lines[lastIndex]);

  return {
    part1: res1,
    part2: lines[lastIndex],
  };
}
