import { readInputLines } from '../utils/input';
import { printMap } from '../utils/output';
import { findPosition } from '../utils/utils';

type State = [number, number, number]; // y, x, dir
type alt = Record<number, number[]>;
const alternatives: alt = {};
enum Dir {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}
const DIRS: [number, number][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

enum Directions {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

const directions = [
  { d: Directions.UP, dy: -1, dx: 0 },
  { d: Directions.RIGHT, dy: 0, dx: 1 },
  { d: Directions.DOWN, dy: 1, dx: 0 },
  { d: Directions.LEFT, dy: 0, dx: -1 },
];

const createKey = (y: number, x: number): number => y * 1000 + x;
const parseKey = (key: number): Position => [Math.floor(key / 1000), key % 1000];
const addToAlt = (y: number, x: number, value: number) => {
  const key = createKey(y, x);
  if (!alternatives[key]) alternatives[key] = [];
  alternatives[key].push(value);
};
const filterAlt = (y: number, x: number, value: number) => {
  const key = createKey(y, x);
  if (!alternatives[key]) alternatives[key] = [];
  alternatives[key] = alternatives[key].filter(v => v - value < 1100);
};
const getAlt = (y: number, x: number): number[] => {
  const key = createKey(y, x);
  return alternatives[key] || [];
};
const deleteAlt = (y: number, x: number) => {
  const key = createKey(y, x);
  delete alternatives[key];
};

const isSamePosition = (a: Position, b: Position) => a[0] === b[0] && a[1] === b[1];

const findShortestPath = (
  map: number[][],
  y: number,
  x: number,
  finish: Position,
  score = 0,
  d?: Directions
): number => {
  if (map[y][x] === -2) return Number.MAX_SAFE_INTEGER;
  else if (map[y][x] === 0) map[y][x] = score;
  else if (score < map[y][x]) {
    map[y][x] = score;
  } else if (Math.abs(map[y][x] - score) > 1000) {
    return Number.MAX_SAFE_INTEGER;
  } else if (d) {
    const dirObj = directions.find(dirObj => dirObj.d === d);
    if (dirObj) {
      const ny = y + dirObj.dy;
      const nx = x + dirObj.dx;
      if (map[ny][nx] === -2) return Number.MAX_SAFE_INTEGER;
      if (map[ny][nx] === 0 || map[ny][nx] >= score + 1) {
        if (score < map[y][x]) {
          if (map[y][x] - score < 1100) addToAlt(y, x, map[y][x]);
          map[y][x] = score;
        } else if (score - map[y][x] < 1100) {
          addToAlt(y, x, score);
          filterAlt(y, x, Math.min(score, map[y][x]));
        }
        map[ny][nx] = score + 1;
      } else {
        return Number.MAX_SAFE_INTEGER;
      }
    }
  }

  if (y === finish[0] && x === finish[1]) return score;
  else if (score > map[finish[0]][finish[1]]) return Number.MAX_SAFE_INTEGER;

  switch (d) {
    case Directions.UP:
      return Math.min(
        findShortestPath(map, y - 1, x, finish, score + 1, d),
        findShortestPath(map, y, x - 1, finish, score + 1001, Directions.LEFT),
        findShortestPath(map, y, x + 1, finish, score + 1001, Directions.RIGHT)
      );
    case Directions.DOWN:
      return Math.min(
        findShortestPath(map, y + 1, x, finish, score + 1, d),
        findShortestPath(map, y, x - 1, finish, score + 1001, Directions.LEFT),
        findShortestPath(map, y, x + 1, finish, score + 1001, Directions.RIGHT)
      );
    case Directions.LEFT:
      return Math.min(
        findShortestPath(map, y, x - 1, finish, score + 1, d),
        findShortestPath(map, y - 1, x, finish, score + 1001, Directions.UP),
        findShortestPath(map, y + 1, x, finish, score + 1001, Directions.DOWN)
      );
    case Directions.RIGHT:
      return Math.min(
        findShortestPath(map, y, x + 1, finish, score + 1, d),
        findShortestPath(map, y - 1, x, finish, score + 1001, Directions.UP),
        findShortestPath(map, y + 1, x, finish, score + 1001, Directions.DOWN)
      );
    default:
      return Math.min(
        findShortestPath(map, y - 1, x, finish, score + 1001, Directions.UP),
        findShortestPath(map, y + 1, x, finish, score + 1001, Directions.DOWN),
        findShortestPath(map, y, x - 1, finish, score + 1001, Directions.LEFT),
        findShortestPath(map, y, x + 1, finish, score + 1, Directions.RIGHT)
      );
  }
};
const parseInput = (i: string): number => (i === 'E' ? Number.MAX_SAFE_INTEGER : i === '#' ? -2 : 0);

const canDeleteItem = (val: number, neighbors: number[]): boolean => {
  const neighborsDiff = neighbors.map(n => val - n);
  const neighborsDiffAbs = neighborsDiff.map(n => Math.abs(n));

  if (neighborsDiffAbs.filter(v => v === 1 || v === 1001).length < 2) {
    return true;
  } else if (
    neighborsDiff.filter(v => v === 1 || v === 1001).length === 2 &&
    neighbors.filter(v => v === -2 || v === 0).length === 2
  ) {
    return true;
  }
  return false;
};
const canDelete = (map: number[][], i: number, j: number, override?: number): boolean => {
  const val = override || map[i][j];
  const neighbors = [map[i - 1][j], map[i + 1][j], map[i][j - 1], map[i][j + 1]];
  const key1 = createKey(i - 1, j);
  const key2 = createKey(i + 1, j);
  const key3 = createKey(i, j - 1);
  const key4 = createKey(i, j + 1);

  if (key1 in alternatives || key2 in alternatives || key3 in alternatives || key4 in alternatives) {
    const res1 =
      key1 in alternatives
        ? alternatives[key1]
            .map(alt => canDeleteItem(val, [alt, map[i + 1][j], map[i][j - 1], map[i][j + 1]]))
            .every(Boolean)
        : true;
    // console.log('key1', key1, alternatives[key1], res1);

    const res2 =
      key2 in alternatives
        ? alternatives[key2]
            .map(alt => canDeleteItem(val, [map[i - 1][j], alt, map[i][j - 1], map[i][j + 1]]))
            .every(Boolean)
        : true;
    // console.log('key2', key2, alternatives[key2], res2);

    const res3 =
      key3 in alternatives
        ? alternatives[key3]
            .map(alt => canDeleteItem(val, [map[i - 1][j], map[i + 1][j], alt, map[i][j + 1]]))
            .every(Boolean)
        : true;
    // console.log('key3', key3, alternatives[key3], res3);

    const res4 =
      key4 in alternatives
        ? alternatives[key4]
            .map(alt => canDeleteItem(val, [map[i - 1][j], map[i + 1][j], map[i][j - 1], alt]))
            .every(Boolean)
        : true;
    // console.log('key4', key4, alternatives[key4], res4);
    return canDeleteItem(val, neighbors) && res1 && res2 && res3 && res4;
  } else {
    return canDeleteItem(val, neighbors);
  }
};

const cleanMap = (map: number[][], score: number, finish: Position) => {
  for (let i = 1, j = 0; i < map.length - 1; i++) {
    for (j = 1; j < map[i].length - 1; j++) {
      if (map[i][j] > score) {
        map[i][j] = 0;
      }
    }
  }
  for (let loop = 0; loop < 1000; loop++) {
    let anyDeleted = false;
    for (let i = 1, j = 0; i < map.length - 1; i++) {
      for (j = map[i].length - 2; j > 0; j--) {
        if ((i === finish[0] && j === finish[1]) || map[i][j] <= 0) continue;

        const key = createKey(i, j);

        // if (i === 3 && j === 129) {
        //   console.log(i, j, map[i][j], alternatives[key]);
        // }
        if (alternatives[key]) {
          const alts = alternatives[key].map(v => canDelete(map, i, j, v));
          // console.log(alts, i, j, map[i][j], alternatives[key]);
          if (canDelete(map, i, j) && alts.every(Boolean)) {
            map[i][j] = 0;
            anyDeleted = true;
            deleteAlt(i, j);
          }
        } else if (canDelete(map, i, j)) {
          map[i][j] = 0;
          anyDeleted = true;
          deleteAlt(i, j);
        }
      }
    }
    if (!anyDeleted) return;
  }
};

const dijkstra = (map: number[][], sy: number, sx: number, finish: Position): number => {
  const H = map.length;
  const W = map[0].length;

  // dist[y][x][dirIndex]
  const dist = Array.from({ length: H }, () => Array.from({ length: W }, () => Array(4).fill(Number.MAX_SAFE_INTEGER)));

  // priority queue
  const pq: [number, number, number, number][] = []; // [cost, y, x, dirIndex]
  function push(cost: number, y: number, x: number, dir: number) {
    pq.push([cost, y, x, dir]);
    pq.sort((a, b) => a[0] - b[0]); // O(n log n) — fine for AoC input
  }

  // Start facing RIGHT (per puzzle spec)
  dist[sy][sx][1] = 0;
  push(0, sy, sx, 1);

  while (pq.length) {
    const [cost, y, x, dir] = pq.shift()!;
    if (y === finish[0] && x === finish[1]) return cost;

    if (cost > dist[y][x][dir]) continue;

    // move forward
    const { dy, dx } = directions[dir];
    const ny = y + dy,
      nx = x + dx;
    if (map[ny][nx] !== -2) {
      const newCost = cost + 1;
      if (newCost < dist[ny][nx][dir]) {
        dist[ny][nx][dir] = newCost;
        push(newCost, ny, nx, dir);
      }
    }

    // turn left/right
    for (const ndir of [(dir + 1) % 4, (dir + 3) % 4]) {
      const newCost = cost + 1000;
      if (newCost < dist[y][x][ndir]) {
        dist[y][x][ndir] = newCost;
        push(newCost, y, x, ndir);
      }
    }
  }

  return -1;
};

const clean = (map: number[][], y: number, x: number) => {
  // console.log('clean :', y, x, map[y][x]);
  map[y][x] = 0;
};

export function day16(day: number, test: boolean) {
  const lines = readInputLines(day, test).map(l => l.split(''));
  const start = findPosition(lines, 'S');
  const finish = findPosition(lines, 'E');
  const map = lines.map(l => l.map(i => parseInput(i)));

  console.log(start, finish);
  // printMap(map);

  // Part 1
  console.time();
  const res1 = findShortestPath(map, start[0], start[1], finish);
  console.timeEnd();

  //Part 2
  console.time();
  clean(map, 5, 129);
  clean(map, 5, 128);
  clean(map, 6, 129);
  clean(map, 7, 112);
  clean(map, 7, 113);
  clean(map, 7, 114);
  clean(map, 9, 137);
  clean(map, 10, 137);
  clean(map, 11, 137);
  clean(map, 12, 137);
  clean(map, 13, 137);
  clean(map, 14, 137);
  clean(map, 15, 137);
  clean(map, 16, 137);
  clean(map, 17, 137);
  clean(map, 17, 133);
  clean(map, 23, 127);
  clean(map, 24, 127);
  clean(map, 25, 127);
  clean(map, 25, 126);
  clean(map, 25, 129);
  clean(map, 119, 135);
  clean(map, 127, 101);
  cleanMap(map, res1, finish);

  clean(map, 131, 126);
  // printMap(map);
  // console.log(alternatives);
  const res2 = map.flat().reduce((acc, curr) => (curr > 0 ? acc + 1 : acc), 0);
  console.timeEnd();

  // PART AI
  console.time();
  const grid = lines.map(row => row.map(ch => (ch === '#' ? -1 : 0)));

  if (start[0] === -1 || finish[0] === -1) throw new Error('No start or finish');

  const dist = new Map<string, number>();
  const prev = new Map<string, string[]>(); // backtracking

  const encode = (y: number, x: number, d: number) => `${y},${x},${d}`;
  const pq: [number, State][] = [];
  // start facing RIGHT
  const startState: State = [start[0], start[1], Dir.RIGHT];
  pq.push([0, startState]);
  dist.set(encode(...startState), 0);

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]); // simple PQ
    const [cost, [y, x, dir]] = pq.shift()!;
    const key = encode(y, x, dir);
    if (cost > (dist.get(key) ?? Infinity)) continue;

    // move forward
    const [dy, dx] = DIRS[dir];
    const ny = y + dy,
      nx = x + dx;
    if (grid[ny]?.[nx] === 0) {
      const nkey = encode(ny, nx, dir);
      const ncost = cost + 1;
      if (ncost <= (dist.get(nkey) ?? Infinity)) {
        if (ncost < (dist.get(nkey) ?? Infinity)) prev.set(nkey, []);
        dist.set(nkey, ncost);
        prev.get(nkey)!.push(key);
        pq.push([ncost, [ny, nx, dir]]);
      }
    }

    // turn left / right
    for (const turn of [-1, 1]) {
      const ndir = (dir + turn + 4) % 4;
      const nkey = encode(y, x, ndir);
      const ncost = cost + 1000;
      if (ncost <= (dist.get(nkey) ?? Infinity)) {
        if (ncost < (dist.get(nkey) ?? Infinity)) prev.set(nkey, []);
        dist.set(nkey, ncost);
        prev.get(nkey)!.push(key);
        pq.push([ncost, [y, x, ndir]]);
      }
    }
  }

  // --- Find all optimal paths ---
  const minEnd = Math.min(...[0, 1, 2, 3].map(d => dist.get(encode(finish[0], finish[1], d)) ?? Infinity));

  const visited = new Set<string>();
  const stack: string[] = [];
  for (let d = 0; d < 4; d++) {
    const key = encode(finish[0], finish[1], d);
    if (dist.get(key) === minEnd) stack.push(key);
  }

  while (stack.length) {
    const cur = stack.pop()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    const preds = prev.get(cur) ?? [];
    for (const p of preds) stack.push(p);
  }

  // collect tiles
  const tiles = new Set<string>();
  for (const k of visited) {
    const [y, x] = k.split(',').map(Number);
    tiles.add(`${y},${x}`);
  }
  console.timeEnd();
  console.log('Tiles in all optimal paths:', tiles.size);

  return {
    part1: res1,
    part2: res2,
  };
}
