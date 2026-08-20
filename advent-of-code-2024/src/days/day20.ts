import { Direction, directions } from '../types';
import { readInputLines } from '../utils/input';
import { printMap } from '../utils/output';
import { findPosition, isSameLocation, sum } from '../utils/utils';

const createKey = (y: number, x: number) => `${y}_${x}`;
const parseKey = (key: string): Position => {
  const [y, x] = key.split('_');
  return [Number(y), Number(x)];
};

const addToMemo = (memo: Map<string, number>, start: Position, y: number, x: number, val: number) => {
  const key = `${start[0]}_${start[1]}_${y}_${x}`;
  memo.set(key, val);
};
const parseInput = (i: string): number => (i === 'E' ? Number.MAX_SAFE_INTEGER : i === '#' ? -1 : 0);

const calcPaths = (
  grid: number[][],
  y: number,
  x: number,
  start: Position,
  finish: Position,
  step = 0,
  d?: Direction
): number => {
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length || grid[y][x] === -1) return Number.MAX_SAFE_INTEGER;
  if (grid[y][x] > 0 && step >= grid[y][x]) return Number.MAX_SAFE_INTEGER;

  if (y !== start[0] || x !== start[1]) grid[y][x] = step;
  if (y === finish[0] && x === finish[1]) return step;

  const res1 =
    d === Direction.UP ? Number.MAX_SAFE_INTEGER : calcPaths(grid, y + 1, x, start, finish, step + 1, Direction.DOWN);
  const res2 =
    d === Direction.LEFT
      ? Number.MAX_SAFE_INTEGER
      : calcPaths(grid, y, x + 1, start, finish, step + 1, Direction.RIGHT);
  const res3 =
    d === Direction.DOWN ? Number.MAX_SAFE_INTEGER : calcPaths(grid, y - 1, x, start, finish, step + 1, Direction.UP);
  const res4 =
    d === Direction.RIGHT
      ? Number.MAX_SAFE_INTEGER
      : calcPaths(grid, y, x - 1, start, finish, step + 1, Direction.LEFT);

  return Math.min(res1, res2, res3, res4);
};

// Non-recursive version using BFS
const calcPathsIterative = (grid: number[][], y: number, x: number, start: Position, finish: Position): number => {
  const queue: Array<{ y: number; x: number; step: number; prevDir?: Direction }> = [];
  queue.push({ y, x, step: 0 });

  while (queue.length > 0) {
    const { y, x, step, prevDir } = queue.shift()!;
    if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length || grid[y][x] === -1) continue;
    if (grid[y][x] > 0 && grid[y][x] <= step) continue;

    if (y !== start[0] || x !== start[1]) grid[y][x] = step;
    if (y === finish[0] && x === finish[1]) return step;

    for (const [dir, { dx, dy }] of Object.entries(directions)) {
      // Prevent going back in the direction we just came from
      if (
        (prevDir === Direction.UP && Number(dir) === Direction.DOWN) ||
        (prevDir === Direction.DOWN && Number(dir) === Direction.UP) ||
        (prevDir === Direction.LEFT && Number(dir) === Direction.RIGHT) ||
        (prevDir === Direction.RIGHT && Number(dir) === Direction.LEFT)
      ) {
        continue;
      }
      queue.push({ y: y + dy, x: x + dx, step: step + 1, prevDir: Number(dir) });
    }
  }
  return Number.MAX_SAFE_INTEGER;
};

const generateJumps = (map: number[][], finish: Position, test: boolean) => {
  const shortcuts: Record<number, number> = {};

  for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[i].length - 1; j++) {
      if (map[i][j] === -1) continue;
      if (isSameLocation([i, j], finish)) continue;

      for (let dir of Object.values(directions)) {
        const { dx, dy } = dir;
        const y1 = i + dy;
        const x1 = j + dx;
        if (map[y1][x1] === -1) {
          const y2 = i + 2 * dy;
          const x2 = j + 2 * dx;
          if (y2 < 0 || y2 >= map.length || x2 < 0 || x2 >= map[0].length) continue;

          if (map[y2][x2] > 0 && map[i][j] + 2 < map[y2][x2]) {
            const diff = map[y2][x2] - (map[i][j] + 2);

            if (!test && diff < 100) continue;

            if (!shortcuts[diff]) shortcuts[diff] = 0;
            shortcuts[diff]++;
          }
        }
      }
    }
  }
  return shortcuts;
};
let counter = 0;
const shortcut = (
  grid: number[][],
  y: number,
  x: number,
  start: Position,
  finish: Position,
  limit: number,
  direction?: Direction,
  jumps = 0,
  steps = 0,
  memo = new Map<string, number>()
) => {
  if (x <= 0 || y <= 0 || y >= grid.length - 1 || x >= grid[0].length - 1 || jumps > 20 || steps > grid.length) {
    // console.log('limit', y, x);
    return memo;
  }
  if (steps > 0 && grid[y][x] !== -1 && grid[y][x] <= grid[start[0]][start[1]] + steps) {
    // console.log('start', y, x);
    return memo;
  }
  const diff = grid[y][x] - (grid[start[0]][start[1]] + steps);
  if (grid[y][x] > 0 && diff >= limit) {
    // console.log('memo', y, x, diff);
    addToMemo(memo, start, y, x, diff);
    return memo;
  }

  Object.entries(directions).forEach(([dir, { dy, dx }]) => {
    const y1 = y + dy;
    const x1 = x + dx;

    if (direction === Direction.DOWN && Number(dir) === Direction.UP) return memo;
    if (direction === Direction.UP && Number(dir) === Direction.DOWN) return memo;
    if (direction === Direction.LEFT && Number(dir) === Direction.RIGHT) return memo;
    if (direction === Direction.RIGHT && Number(dir) === Direction.LEFT) return memo;

    if (grid[y1][x1] === -1) {
      return shortcut(grid, y1, x1, start, finish, limit, Number(dir), jumps + 1, steps + 1, memo);
    } else if (grid[y1][x1] > grid[start[0]][start[1]] + steps + 1) {
      return shortcut(grid, y1, x1, start, finish, limit, Number(dir), jumps, steps + 1, memo);
    }
  });
  return memo;
};

const generateShortcuts = (map: number[][], finish: Position, limit: number) => {
  const shortcuts: Record<number, number> = {};

  for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[i].length - 1; j++) {
      if (map[i][j] === -1) continue;
      if (isSameLocation([i, j], finish)) continue;

      const shorts = shortcut(map, i, j, [i, j], finish, limit);
      shorts.forEach(value => {
        if (value in shortcuts) {
          shortcuts[value]++;
        } else {
          shortcuts[value] = 1;
        }
      });
      console.log(shorts);
    }
  }
  return shortcuts;
};

function computePath(
  grid: string[][],
  start: Position,
  end: Position
): { path: Position[]; idxMap: Map<string, number> } {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set<string>();
  const parent = new Map<string, string>(); // to reconstruct path

  const key = (y: number, x: number) => `${y},${x}`;
  const dirs: Position[] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const queue: Position[] = [start];
  visited.add(key(...start));

  // BFS loop
  while (queue.length > 0) {
    const [y, x] = queue.shift()!;
    if (y === end[0] && x === end[1]) break;

    for (const [dy, dx] of dirs) {
      const ny = y + dy;
      const nx = x + dx;
      if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && grid[ny][nx] !== '#' && !visited.has(key(ny, nx))) {
        visited.add(key(ny, nx));
        parent.set(key(ny, nx), key(y, x));
        queue.push([ny, nx]);
      }
    }
  }

  // Reconstruct path from end → start
  const path: Position[] = [];
  let cur: string | undefined = key(...end);
  while (cur) {
    const [y, x] = cur.split(',').map(Number);
    path.push([y, x]);
    cur = parent.get(cur);
  }

  // Path is reversed (end→start), fix it
  path.reverse();

  // Build lookup map (position → index in path)
  const idxMap = new Map<string, number>();
  path.forEach(([y, x], idx) => {
    idxMap.set(key(y, x), idx);
  });

  return { path, idxMap };
}
// 2. Compute Manhattan distance
function manhattan([y1, x1]: Position, [y2, x2]: Position): number {
  return Math.abs(y1 - y2) + Math.abs(x1 - x2);
}
function countCheats(path: Position[], idxMap: Map<string, number>): number {
  const maxCheat = 20;
  let count = 0;

  for (let i = 0; i < path.length; i++) {
    const [y1, x1] = path[i];
    const idx1 = i;

    for (let j = i + 1; j < path.length; j++) {
      const [y2, x2] = path[j];
      const idx2 = j;
      const d = manhattan(path[i], path[j]);

      if (d <= maxCheat) {
        const saved = idx2 - idx1 - d;
        if (saved >= 100) {
          count++;
        }
      }
    }
  }

  return count;
}

export function day20(day: number, test: boolean) {
  const input = readInputLines(day, test).map(l => l.split(''));
  const start = findPosition(input, 'S');
  const finish = findPosition(input, 'E');
  const map = input.map(l => l.map(i => parseInput(i)));

  // Part 1
  console.time();
  const res1 = calcPathsIterative(map, start[0], start[1], start, finish);
  const jumps = generateJumps(map, finish, test);

  console.timeEnd();
  // printMap(map);
  // console.log(jumps);

  //Part 2
  // printMap(map);
  // console.time();
  // const shortcuts = generateShortcuts(map, finish, test ? 50 : 100);
  // console.timeEnd();
  // console.log(shortcuts);

  const { path, idxMap } = computePath(input, start, finish);
  const res2 = countCheats(path, idxMap);
  console.log(res2);

  return {
    part1: sum(Object.values(jumps)),
    part2: res2,
  };
}
