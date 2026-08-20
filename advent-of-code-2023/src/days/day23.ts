import { Direction, directions, Grid, MapPosition } from '../types';
import { readMap } from '../utils/input';
import {
  getKey,
  inBounds,
  isOppositeDirection,
  isSlope,
  SlopeDirections,
  solveLongestPath,
  Tile,
} from '../utils/longWalk';
import { isSamePosition, max } from '../utils/utils';

type State = {
  pos: MapPosition;
  from?: Direction;
  visited: Set<string>;
  depth: number;
};

const partOne = (
  grid: Grid,
  position: MapPosition,
  finish: MapPosition,
  direction?: Direction,
  path: MapPosition[] = [],
  paths: MapPosition[][] = []
): MapPosition[][] => {
  if (!inBounds(grid, position) || path.length > grid.length * grid[0].length) {
    return paths;
  }
  if (isSamePosition(position, finish)) {
    paths.push(path);
    return paths;
  }

  const { y, x } = position;
  const tile = grid[y][x] as Tile;
  if (grid[y][x] === Tile.FOREST || (isSlope(tile) && SlopeDirections[tile] !== direction)) {
    return paths;
  }
  path.push(position);

  for (const [d, { dy, dx }] of Object.entries(directions)) {
    const dir = Number(d) as Direction;
    if (direction !== undefined && isOppositeDirection(direction, dir)) {
      continue;
    }

    const newPos = { x: x + dx, y: y + dy };
    partOne(grid, newPos, finish, dir, [...path], paths);
  }

  return paths;
};

const partTwo = (grid: Grid, start: MapPosition, finish: MapPosition): number => {
  let maxLen = 0;
  const queue: { pos: MapPosition; length: number; visited: Set<string> }[] = [];
  queue.push({ pos: start, length: 0, visited: new Set([`${start.y},${start.x}`]) });

  let counter = 0;
  while (queue.length > 0) {
    counter++;
    if (counter % 1000000 === 0) {
      console.log(`Explored ${counter} positions, queue length: ${queue.length}`);
    }
    const { pos, length, visited } = queue.shift()!;
    if (!inBounds(grid, pos)) continue;
    if (grid[pos.y][pos.x] === Tile.FOREST) continue;

    if (isSamePosition(pos, finish)) {
      console.log(`Reached finish with length ${length}  Max:${maxLen}`);
      if (length > maxLen) maxLen = length;
      continue;
    }

    for (const { dy, dx } of Object.values(directions)) {
      const newPos = { x: pos.x + dx, y: pos.y + dy };
      const key = `${newPos.y},${newPos.x}`;

      if (!inBounds(grid, newPos)) continue;
      if (grid[newPos.y][newPos.x] === Tile.FOREST) continue;
      if (visited.has(key)) continue;

      const newVisited = new Set(visited);
      newVisited.add(key);
      queue.push({ pos: newPos, length: length + 1, visited: newVisited });
    }
  }

  return maxLen;
};

const partTwoDFS = (grid: Grid, start: MapPosition, finish: MapPosition): number => {
  const height = grid.length;
  const width = grid[0].length;

  let maxLen = 0;

  // Stack entries contain current position, current path length, and visited set for backtracking
  const stack: { pos: MapPosition; length: number; visited: Set<string> }[] = [];

  stack.push({ pos: start, length: 0, visited: new Set([`${start.y},${start.x}`]) });

  while (stack.length > 0) {
    const { pos, length, visited } = stack.pop()!;
    const { y, x } = pos;

    if (y < 0 || x < 0 || y >= height || x >= width) continue;
    if (grid[y][x] === Tile.FOREST) continue;

    // Reached the end
    if (isSamePosition(pos, finish)) {
      if (length > maxLen) maxLen = length;
      continue;
    }

    // Try all directions
    for (const { dy, dx } of Object.values(directions)) {
      const newY = y + dy;
      const newX = x + dx;
      const key = `${newY},${newX}`;

      if (newY < 0 || newX < 0 || newY >= height || newX >= width) continue;
      if (grid[newY][newX] === Tile.FOREST) continue;
      if (visited.has(key)) continue; // don’t revisit

      const newVisited = new Set(visited);
      newVisited.add(key);
      stack.push({ pos: { y: newY, x: newX }, length: length + 1, visited: newVisited });
    }
  }

  return maxLen;
};

function longestPathDFS(grid: string[][], start: MapPosition, end: MapPosition): number {
  // const cache = new Map<string, number>();
  const stack: State[] = [{ pos: start, visited: new Set(), depth: 0 }];
  let best = -Infinity;
  let counterk = 0;
  // let cacheSkipped = 0;

  while (stack.length > 0) {
    const { pos, from, visited, depth } = stack.pop()!;
    // const { pos, from, visited, depth } = state;
    // counter++;
    // if (counter % 1_000_000 === 0) {
    //   console.log(
    //     `Explored ${counter} states, current depth ${depth}, stack size: ${stack.length}, cache size: ${cache.size}, skipped: ${cacheSkipped}`
    //   );
    // }

    if (!inBounds(grid, pos) || grid[pos.y][pos.x] === Tile.FOREST) continue;

    const id = getKey(pos.y, pos.x);
    if (visited.has(id)) continue;
    if (isSamePosition(pos, end)) {
      console.log(`Reached finish with length ${depth}  Max:${best}, stack size: ${stack.length}`);
      best = Math.max(best, depth);
      continue;
    }

    visited.add(id);
    // cache key includes visited cells to prune duplicate paths
    // const visitedKey = [...visited].sort().join('|');
    // const cacheKey = `${visitedKey}`;
    // if (cache.has(cacheKey)) {
    //   cacheSkipped++;
    //   continue;
    // }
    // cache.set(cacheKey, depth);

    // Explore all directions except directly backwards
    for (const [dStr, { dy, dx }] of Object.entries(directions)) {
      const dir = Number(dStr) as Direction;
      if (from !== undefined && isOppositeDirection(from, dir)) continue;
      const next = { y: pos.y + dy, x: pos.x + dx };

      if (!inBounds(grid, next)) continue;
      if (grid[next.y][next.x] === Tile.FOREST) continue;

      stack.push({
        pos: next,
        from: dir,
        visited: dir === from ? visited : new Set(visited),
        depth: depth + 1,
      });
    }
  }

  return best;
}

const partTwoGraph = (grid: Grid, start: MapPosition, finish: MapPosition): number => {
  grid[start.y][start.x] = Tile.START;
  grid[finish.y][finish.x] = Tile.END;
  return solveLongestPath(grid, start, finish);
};

export function day23(day: number, test: boolean) {
  const grid = readMap(day, test);

  const startX = grid[0].findIndex(t => t === Tile.PATH);
  const endX = grid[grid.length - 1].findIndex(t => t === Tile.PATH);

  const start = { x: startX, y: 0 };
  const finish = { x: endX, y: grid.length - 1 };

  // Part 1
  console.time();
  const res1 = partOne(grid, start, finish);
  console.timeEnd();

  // Part 2
  console.time();
  // const res2 = longestPathDFS(grid, start, finish);
  const res2 = partTwoGraph(grid, start, finish);
  console.timeEnd();

  return {
    part1: max(res1.map(p => p.length)),
    part2: res2,
  };
}
