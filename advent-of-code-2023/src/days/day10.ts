import { Direction, MapPosition } from '../types';
import { readInput, readMap } from '../utils/input';
import { printMap } from '../utils/output';
import { findPosition, isSamePosition } from '../utils/utils';
type Point = { x: number; y: number };
type Dir = 'N' | 'S' | 'E' | 'W';
type Pipe = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';

// Define valid connections for each pipe type
const connections: Record<Pipe, Dir[]> = {
  '|': ['N', 'S'],
  '-': ['E', 'W'],
  L: ['N', 'E'],
  J: ['N', 'W'],
  '7': ['S', 'W'],
  F: ['S', 'E'],
  '.': [],
  S: [], // Will determine dynamically
};

// Opposite directions for connection validation
const opposites: Record<Dir, Dir> = {
  N: 'S',
  S: 'N',
  E: 'W',
  W: 'E',
};

// Possible moves from a point
const moves: Record<Dir, Point> = {
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  W: { x: -1, y: 0 },
};

function solve(input: string): number {
  const grid = input
    .trim()
    .split('\n')
    .map(row => row.split('') as Pipe[]);
  const rows = grid.length;
  const cols = grid[0].length;
  let start: Point = { x: 0, y: 0 };

  // Find start position 'S'
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 'S') {
        start = { x, y };
        break;
      }
    }
  }

  // Infer the pipe type at 'S'
  const sConnections: Dir[] = [];
  const directions: Dir[] = ['N', 'S', 'E', 'W'];
  for (const dir of directions) {
    const move = moves[dir];
    const nx = start.x + move.x;
    const ny = start.y + move.y;
    if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
      const neighborPipe = grid[ny][nx];
      if (connections[neighborPipe].includes(opposites[dir])) {
        sConnections.push(dir);
      }
    }
  }
  // Determine 'S' pipe type based on connections
  const sPipe = Object.keys(connections).find(
    pipe =>
      pipe !== 'S' &&
      pipe !== '.' &&
      connections[pipe as Pipe].length === sConnections.length &&
      connections[pipe as Pipe].every(d => sConnections.includes(d))
  ) as Pipe;
  grid[start.y][start.x] = sPipe;

  // Find the loop using iterative DFS
  const loop: Point[] = [];
  const visited = new Set<string>();
  const stack: { pos: Point; prev: Point | null }[] = [{ pos: start, prev: null }];

  while (stack.length > 0) {
    const { pos, prev } = stack.pop()!;
    const key = `${pos.x},${pos.y}`;
    if (visited.has(key)) continue;
    visited.add(key);
    loop.push(pos);

    const pipe = grid[pos.y][pos.x];
    for (const dir of connections[pipe]) {
      const move = moves[dir];
      const next = { x: pos.x + move.x, y: pos.y + move.y };
      if (
        next.x >= 0 &&
        next.x < cols &&
        next.y >= 0 &&
        next.y < rows &&
        (!prev || next.x !== prev.x || next.y !== prev.y)
      ) {
        const nextPipe = grid[next.y][next.x];
        if (connections[nextPipe].includes(opposites[dir])) {
          stack.push({ pos: next, prev: pos });
        }
      }
    }
  }

  // Calculate enclosed area using the shoelace formula
  const area =
    Math.abs(
      loop.reduce((sum, p, i) => {
        const next = loop[(i + 1) % loop.length];
        return sum + p.x * next.y - p.y * next.x;
      }, 0)
    ) / 2;

  // Use Pick's theorem: A = i + b/2 - 1, where i is interior points, b is boundary points
  const boundary = loop.length;
  const interiorPoints = area - boundary / 2 + 1;

  return Math.floor(interiorPoints);
}

enum Tile {
  VERTICAL = '|',
  HORIZONTAL = '-',
  NE = 'L',
  NW = 'J',
  SE = 'F',
  SW = '7',
  GROUND = '.',
  START = 'S',
}

const isNumber = (n: string) => !isNaN(parseInt(n));

const findLoopRecursive = (
  grid: string[][],
  mapValues: number[][],
  start: MapPosition,
  location: MapPosition,
  direction: Direction = Direction.RIGHT,
  step = 1
): boolean => {
  if (location.y < 0 || location.y >= grid.length || location.x < 0 || location.x >= grid[0].length) {
    console.log('Out of bounds');
    return false;
  }
  if (isSamePosition(start, location) && step > 0) {
    console.log('LOOP!', step);
    return true;
  }
  if (grid[location.y][location.x] === Tile.GROUND) {
    console.log('Ground');
    return false;
  }
  if (mapValues[location.y][location.x] > 0 && mapValues[location.y][location.x] < step) {
    console.log('Visited');
    return false;
  }
  mapValues[location.y][location.x] = step;
  if (grid[location.y][location.x] === Tile.HORIZONTAL) {
    return findLoop(
      grid,
      mapValues,
      start,
      { y: location.y, x: direction === Direction.LEFT ? location.x - 1 : location.x + 1 },
      direction,
      step + 1
    );
  }
  if (grid[location.y][location.x] === Tile.VERTICAL) {
    return findLoop(
      grid,
      mapValues,
      start,
      { y: direction === Direction.UP ? location.y - 1 : location.y + 1, x: location.x },
      direction,
      step + 1
    );
  }
  // Edge North - East
  if (grid[location.y][location.x] === Tile.NE && [Direction.DOWN, Direction.LEFT].includes(direction)) {
    return findLoop(
      grid,
      mapValues,
      start,
      {
        y: direction === Direction.LEFT ? location.y - 1 : location.y,
        x: direction === Direction.DOWN ? location.x + 1 : location.x,
      },
      direction === Direction.DOWN ? Direction.RIGHT : Direction.UP,
      step + 1
    );
  }
  // Edge North - West
  if (grid[location.y][location.x] === Tile.NW && [Direction.DOWN, Direction.RIGHT].includes(direction)) {
    return findLoop(
      grid,
      mapValues,
      start,
      {
        y: direction === Direction.RIGHT ? location.y - 1 : location.y,
        x: direction === Direction.DOWN ? location.x - 1 : location.x,
      },
      direction === Direction.DOWN ? Direction.LEFT : Direction.UP,
      step + 1
    );
  }
  // Edge South - East
  if (grid[location.y][location.x] === Tile.SE && [Direction.UP, Direction.LEFT].includes(direction)) {
    console.log('SE', direction, step);
    return findLoop(
      grid,
      mapValues,
      start,
      {
        y: direction === Direction.LEFT ? location.y + 1 : location.y,
        x: direction === Direction.UP ? location.x + 1 : location.x,
      },
      direction === Direction.UP ? Direction.RIGHT : Direction.DOWN,
      step + 1
    );
  }
  // Edge South - West
  if (grid[location.y][location.x] === Tile.SW && [Direction.UP, Direction.RIGHT].includes(direction)) {
    return findLoop(
      grid,
      mapValues,
      start,
      {
        y: direction === Direction.RIGHT ? location.y + 1 : location.y,
        x: direction === Direction.UP ? location.x - 1 : location.x,
      },
      direction === Direction.UP ? Direction.LEFT : Direction.DOWN,
      step + 1
    );
  }

  return false;
};
const findLoop = (
  grid: string[][],
  mapValues: number[][],
  start: MapPosition,
  location: MapPosition,
  direction: Direction = Direction.RIGHT,
  step = 1
): boolean => {
  let curr = { ...location };
  let dir = direction;
  let currStep = step;

  while (true) {
    if (curr.y < 0 || curr.y >= grid.length || curr.x < 0 || curr.x >= grid[0].length) return false;
    else if (isSamePosition(start, curr) && currStep > 0) return true;
    else if (grid[curr.y][curr.x] === Tile.GROUND) return false;
    else if (mapValues[curr.y][curr.x] > 0 && mapValues[curr.y][curr.x] < currStep) return false;

    mapValues[curr.y][curr.x] = currStep;

    const tile = grid[curr.y][curr.x];
    let next = { ...curr };
    let nextDir = dir;

    if (tile === Tile.HORIZONTAL) {
      next.x = dir === Direction.LEFT ? curr.x - 1 : curr.x + 1;
    } else if (tile === Tile.VERTICAL) {
      next.y = dir === Direction.UP ? curr.y - 1 : curr.y + 1;
    } else if (tile === Tile.NE && [Direction.DOWN, Direction.LEFT].includes(dir)) {
      next.y = dir === Direction.LEFT ? curr.y - 1 : curr.y;
      next.x = dir === Direction.DOWN ? curr.x + 1 : curr.x;
      nextDir = dir === Direction.DOWN ? Direction.RIGHT : Direction.UP;
    } else if (tile === Tile.NW && [Direction.DOWN, Direction.RIGHT].includes(dir)) {
      next.y = dir === Direction.RIGHT ? curr.y - 1 : curr.y;
      next.x = dir === Direction.DOWN ? curr.x - 1 : curr.x;
      nextDir = dir === Direction.DOWN ? Direction.LEFT : Direction.UP;
    } else if (tile === Tile.SE && [Direction.UP, Direction.LEFT].includes(dir)) {
      next.y = dir === Direction.LEFT ? curr.y + 1 : curr.y;
      next.x = dir === Direction.UP ? curr.x + 1 : curr.x;
      nextDir = dir === Direction.UP ? Direction.RIGHT : Direction.DOWN;
    } else if (tile === Tile.SW && [Direction.UP, Direction.RIGHT].includes(dir)) {
      next.y = dir === Direction.RIGHT ? curr.y + 1 : curr.y;
      next.x = dir === Direction.UP ? curr.x - 1 : curr.x;
      nextDir = dir === Direction.UP ? Direction.LEFT : Direction.DOWN;
    } else {
      return false;
    }

    curr = next;
    dir = nextDir;
    currStep++;
  }
};

const findPaths = (
  grid: Array<Array<string | number>>,
  start: MapPosition,
  location: MapPosition,
  direction: Direction = Direction.RIGHT,
  step = 1
): boolean => {
  if (location.y < 0 || location.y >= grid.length || location.x < 0 || location.x >= grid[0].length) {
    console.log('Out of bounds', location);
    return false;
  }
  const field = grid[location.y][location.x];
  if (field === Tile.GROUND) {
    console.log('Ground');
    return false;
  }

  // check if is number
  if (typeof field === 'number') {
    console.log('Number', field, parseInt(`${field}`), field === parseInt(`${field}`), step, location);

    return false;
  }

  grid[location.y][location.x] = step;

  if (field === Tile.HORIZONTAL) {
    return findPaths(
      grid,
      start,
      { y: location.y, x: direction === Direction.LEFT ? location.x - 1 : location.x + 1 },
      direction,
      step + 1
    );
  }
  if (field === Tile.VERTICAL) {
    return findPaths(
      grid,
      start,
      { y: direction === Direction.UP ? location.y - 1 : location.y + 1, x: location.x },
      direction,
      step + 1
    );
  }
  // Edge North - East
  if (field === Tile.NE && [Direction.DOWN, Direction.LEFT].includes(direction)) {
    return findPaths(
      grid,
      start,
      {
        y: direction === Direction.LEFT ? location.y - 1 : location.y,
        x: direction === Direction.DOWN ? location.x + 1 : location.x,
      },
      direction === Direction.DOWN ? Direction.RIGHT : Direction.UP,
      step + 1
    );
  }
  // Edge North - West
  if (field === Tile.NW && [Direction.DOWN, Direction.RIGHT].includes(direction)) {
    return findPaths(
      grid,
      start,
      {
        y: direction === Direction.RIGHT ? location.y - 1 : location.y,
        x: direction === Direction.DOWN ? location.x - 1 : location.x,
      },
      direction === Direction.DOWN ? Direction.LEFT : Direction.UP,
      step + 1
    );
  }
  // Edge South - East
  if (field === Tile.SE && [Direction.UP, Direction.LEFT].includes(direction)) {
    console.log('SE', direction, field, location);
    return findPaths(
      grid,
      start,
      {
        y: direction === Direction.LEFT ? location.y + 1 : location.y,
        x: direction === Direction.UP ? location.x + 1 : location.x,
      },
      direction === Direction.UP ? Direction.RIGHT : Direction.DOWN,
      step + 1
    );
  }
  // Edge South - West
  if (field === Tile.SW && [Direction.UP, Direction.RIGHT].includes(direction)) {
    return findPaths(
      grid,
      start,
      {
        y: direction === Direction.RIGHT ? location.y + 1 : location.y,
        x: direction === Direction.UP ? location.x - 1 : location.x,
      },
      direction === Direction.UP ? Direction.LEFT : Direction.DOWN,
      step + 1
    );
  }

  return false;
};

const getPosition = (i: number | MapPosition, gridLength: number): MapPosition => {
  if (typeof i === 'number') {
    return { y: Math.floor(i / gridLength), x: i % gridLength };
  }
  return i;
};

const neighbours = (grid: Array<Array<any>>, i: number | MapPosition): number[] => {
  const n = [];
  const { y, x } = getPosition(i, grid[0].length);
  if (x > 0) n.push(grid[y][x - 1]);
  if (y > 0) n.push(grid[y - 1][x]);
  if (x < grid[0].length - 1) n.push(grid[y][x + 1]);
  if (y < grid.length - 1) n.push(grid[y + 1][x]);

  return n;
};

const isUnshift = () => Math.random() < 0.5;
const neighbourPositions = (grid: Array<Array<any>>, position: MapPosition): MapPosition[] => {
  const n = [];
  const { y, x } = position;
  if (x > 0) n.push({ y, x: x - 1 });
  if (y > 0) isUnshift() ? n.unshift({ y: y - 1, x }) : n.push({ y: y - 1, x });
  if (x < grid[0].length - 1) isUnshift() ? n.unshift({ y, x: x + 1 }) : n.push({ y, x: x + 1 });
  if (y < grid.length - 1) isUnshift() ? n.unshift({ y: y + 1, x }) : n.push({ y: y + 1, x });
  if (x > 0 && y > 0) isUnshift() ? n.unshift({ y: y - 1, x: x - 1 }) : n.push({ y: y - 1, x: x - 1 });
  if (x > 0 && y < grid.length - 1) isUnshift() ? n.unshift({ y: y + 1, x: x - 1 }) : n.push({ y: y + 1, x: x - 1 });
  if (x < grid[0].length - 1 && y > 0) isUnshift() ? n.unshift({ y: y - 1, x: x + 1 }) : n.push({ y: y - 1, x: x + 1 });
  if (x < grid[0].length - 1 && y < grid.length - 1)
    isUnshift() ? n.unshift({ y: y + 1, x: x + 1 }) : n.push({ y: y + 1, x: x + 1 });

  return n;
};
const isLoop = (neighbours: number[], field: number) =>
  neighbours.filter(n => field - 1 === n || n > field).length === 2;

const partOne = (grid: string[][], mapValues: number[][]) => {
  let { y, x } = findPosition(grid, Tile.START);

  // findLoop(grid, mapValues, { y, x }, { y, x: x + 1 });
  findLoop(grid, mapValues, { y, x }, { y, x: x - 1 }, Direction.LEFT);
  findLoop(grid, mapValues, { y, x }, { y: y - 1, x }, Direction.UP);

  return mapValues
    .flat()
    .reduce((acc, curr, idx) => (curr > acc && isLoop(neighbours(mapValues, idx), curr) ? curr : acc), 0);
};

const fillFields = (mapValues: number[][], position: MapPosition, step = -1) => {
  const field = mapValues[position.y][position.x];

  if (field !== 0 || step < -2200) return;
  mapValues[position.y][position.x] = step;

  neighbourPositions(mapValues, position).forEach(n => {
    fillFields(mapValues, n, step - 1);
  });
};

const partTwo = (mapValues: number[][]) => {
  fillFields(mapValues, { y: 68, x: 68 });
  for (let i = 0; i < mapValues[0].length; i++) {
    fillFields(mapValues, { y: 0, x: i });
    fillFields(mapValues, { y: mapValues.length - 1, x: i });
  }
  for (let j = 0; j < mapValues.length; j++) {
    fillFields(mapValues, { y: j, x: 0 });
    fillFields(mapValues, { y: j, x: mapValues[0].length - 1 });
  }
  // printMap(mapValues);

  return mapValues.flat().reduce((acc, curr) => (curr === 0 ? (acc += 1) : acc), 0);
};

export function day10(day: number, test: boolean) {
  const grid = readMap(day, test);
  const mapValues = Array.from({ length: grid.length }).map(() => Array.from({ length: grid[0].length }).map(() => 0));

  // Part 1
  const res1 = partOne(grid, mapValues);

  // Part 2
  const res2 = partTwo(mapValues);
  /**
   * 735 too big
   * 722, 720, 719
   * 646
   * 394 - 74 => 320
   * 396
   * 467
   */
  const res2Grok = solve(readInput(day, test));
  console.log(res2Grok);

  return {
    part1: res1,
    part2: res2,
  };
}
