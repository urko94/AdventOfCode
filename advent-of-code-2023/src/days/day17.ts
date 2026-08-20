import { Direction, DirectionDiff, directions, MapPosition } from '../types';
import { readNumberMap } from '../utils/input';
import { createGrid, getDirections } from '../utils/utils';
import { printGrid, printMap } from '../utils/output';

interface State {
  x: number;
  y: number;
  dir: Direction | null;
  streak: number;
  cost: number;
}

class MinHeap<T> {
  private heap: { key: number; val: T }[] = [];

  push(key: number, val: T) {
    this.heap.push({ key, val });
    this.bubbleUp();
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0].val;
    const last = this.heap.pop();
    if (this.heap.length > 0 && last) {
      this.heap[0] = last;
      this.bubbleDown();
    }
    return top;
  }

  private bubbleUp() {
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[i].key >= this.heap[p].key) break;
      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
      i = p;
    }
  }

  private bubbleDown() {
    let i = 0;
    while (true) {
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      let smallest = i;
      if (l < this.heap.length && this.heap[l].key < this.heap[smallest].key) smallest = l;
      if (r < this.heap.length && this.heap[r].key < this.heap[smallest].key) smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }

  get size() {
    return this.heap.length;
  }
}

const inBounds = (x: number, y: number, grid: number[][]) => y >= 0 && x >= 0 && y < grid.length && x < grid[0].length;

const partOne = (
  grid: number[][],
  mapValues: number[][],
  pos: MapPosition = { y: 0, x: 0 },
  dir?: Direction,
  value: number = 0,
  sameDir: number = 0
) => {
  const { y, x } = pos;
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) return false;
  if (sameDir > 3) return false;

  const currValue = Number(grid[y][x]) + value;
  if (dir && mapValues[y][x] > 0 && mapValues[y][x] <= currValue) {
    return false;
  }
  if (currValue > 7 * grid.length * grid[0].length) {
    return false;
  }

  mapValues[y][x] = currValue;
  if (y === grid.length - 1 && x === grid[0].length - 1) return true;

  const dirs = getDirections(dir ? dir?.toString() : undefined);
  for (const d in dirs) {
    const { dy, dx } = dirs[d];
    const newDir = Number(d) as Direction;
    partOne(grid, mapValues, { y: y + dy, x: x + dx }, newDir, currValue, newDir === dir ? sameDir + 1 : 0);
  }
};

const turnDirs: Record<Direction, Direction[]> = {
  [Direction.UP]: [Direction.LEFT, Direction.RIGHT],
  [Direction.DOWN]: [Direction.LEFT, Direction.RIGHT],
  [Direction.LEFT]: [Direction.UP, Direction.DOWN],
  [Direction.RIGHT]: [Direction.UP, Direction.DOWN],
};

// Dijkstra for Part 2
function solveGrid(grid: number[][], minStraight: number, maxStraight: number): number {
  const h = grid.length;
  const w = grid[0].length;

  const pq = new MinHeap<State>();
  const visited = new Map<string, number>();

  pq.push(0, { x: 0, y: 0, dir: null, streak: 0, cost: 0 });

  while (pq.size) {
    const node = pq.pop()!;
    const key = `${node.x},${node.y},${node.dir},${node.streak}`;
    if (visited.has(key) && visited.get(key)! <= node.cost) continue;
    visited.set(key, node.cost);

    if (node.x === w - 1 && node.y === h - 1) {
      if (node.streak >= minStraight) return node.cost;
    }

    const dirs: Direction[] =
      node.dir === null
        ? [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT]
        : [node.dir, ...turnDirs[node.dir]];

    for (const d of dirs) {
      const { dx, dy } = directions[d];
      const nx = node.x + dx;
      const ny = node.y + dy;
      if (!inBounds(nx, ny, grid)) continue;

      const newStreak = d === node.dir ? node.streak + 1 : 1;

      // Enforce straight-move limits
      if (node.dir !== null && d !== node.dir && node.streak < minStraight) continue;
      if (newStreak > maxStraight) continue;

      const newCost = node.cost + grid[ny][nx];
      pq.push(newCost, { x: nx, y: ny, dir: d, streak: newStreak, cost: newCost });
    }
  }

  throw new Error('No path found');
}

export function day17(day: number, test: boolean) {
  const grid = readNumberMap(day, test);
  // const map = createGrid(grid.length, grid[0].length);
  // printGrid(grid);

  // Part 1
  // partOne(grid, map);
  // printMap(map, 4);
  const res1 = solveGrid(grid, 0, 3);

  // Part 2
  const res2 = solveGrid(grid, 4, 10);

  return {
    part1: res1,
    part2: res2,
  };
}
