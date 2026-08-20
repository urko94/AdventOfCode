import { Direction, directions, MapPosition, Position } from '../types';
import { readInputLines, readMap } from '../utils/input';
import { printGrid } from '../utils/output';
import { createGrid } from '../utils/utils';

enum Field {
  EMPTY = '.',
  MIRROR_LEFT = '/',
  MIRROR_RIGHT = '\\',
  SPLITTER_HORIZONTAL = '-',
  SPLITTER_VERTICAL = '|',
}

const getDirection = (dir: Direction, field: Field) => {
  switch (field) {
    case Field.MIRROR_LEFT:
      switch (dir) {
        case Direction.DOWN:
          return Direction.LEFT;
        case Direction.LEFT:
          return Direction.DOWN;
        case Direction.RIGHT:
          return Direction.UP;
        case Direction.UP:
          return Direction.RIGHT;
      }
    case Field.MIRROR_RIGHT:
      switch (dir) {
        case Direction.DOWN:
          return Direction.RIGHT;
        case Direction.RIGHT:
          return Direction.DOWN;
        case Direction.LEFT:
          return Direction.UP;
        case Direction.UP:
          return Direction.LEFT;
      }
  }
  return dir;
};

const partOneRec = (
  grid: string[][],
  map: number[][],
  pos: MapPosition = { y: 0, x: 0 },
  dir: Direction = Direction.RIGHT
): boolean => {
  const { y, x } = pos;
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) return false;
  if (map[y][x] > 1) {
    const { dx, dy } = directions[dir];
    const newY = y + dy;
    const newX = x + dx;
    if (newX < 0 || newY < 0 || newY >= grid.length || newX >= grid[0].length) return false;
    if (grid[y][x] !== Field.EMPTY || map[y + dy][x + dx] > 1) {
      return false;
    }
  }

  if (grid[y][x] === Field.EMPTY) {
    map[y][x] += 1;
  } else {
    map[y][x] = 1;
  }

  if (grid[y][x] === Field.MIRROR_LEFT || grid[y][x] === Field.MIRROR_RIGHT) {
    const newDir = getDirection(dir, grid[y][x] as Field);
    const { dx, dy } = directions[newDir];
    return partOneRec(grid, map, { y: y + dy, x: x + dx }, newDir);
  } else if (grid[y][x] === Field.SPLITTER_HORIZONTAL && [Direction.UP, Direction.DOWN].includes(dir)) {
    const { dx, dy } = directions[Direction.LEFT];
    const { dx: dxR, dy: dyR } = directions[Direction.RIGHT];
    return (
      partOneRec(grid, map, { y: y + dy, x: x + dx }, Direction.LEFT) ||
      partOneRec(grid, map, { y: y + dyR, x: x + dxR }, Direction.RIGHT)
    );
  } else if (grid[y][x] === Field.SPLITTER_VERTICAL && [Direction.LEFT, Direction.RIGHT].includes(dir)) {
    const { dx, dy } = directions[Direction.UP];
    const { dx: dxD, dy: dyD } = directions[Direction.DOWN];
    return (
      partOneRec(grid, map, { y: y + dy, x: x + dx }, Direction.UP) ||
      partOneRec(grid, map, { y: y + dyD, x: x + dxD }, Direction.DOWN)
    );
  } else {
    const { dx, dy } = directions[dir];
    return partOneRec(grid, map, { y: y + dy, x: x + dx }, dir);
  }
};

const simulateBeam = (
  grid: string[][],
  map: number[][],
  startPos: MapPosition = { y: 0, x: 0 },
  startDir: Direction = Direction.RIGHT
): boolean => {
  const stack: { y: number; x: number; dir: Direction }[] = [{ ...startPos, dir: startDir }];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const { y, x, dir } = stack.pop()!;
    if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) continue;

    const key = `${y},${x},${dir}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (grid[y][x] === Field.EMPTY) map[y][x] += 1;
    else map[y][x] = 1;

    const cell = grid[y][x];

    if (cell === Field.MIRROR_LEFT || cell === Field.MIRROR_RIGHT) {
      const newDir = getDirection(dir, cell as Field);
      const { dx, dy } = directions[newDir];
      stack.push({ y: y + dy, x: x + dx, dir: newDir });
    } else if (cell === Field.SPLITTER_HORIZONTAL && [Direction.UP, Direction.DOWN].includes(dir)) {
      const { dx: dxL, dy: dyL } = directions[Direction.LEFT];
      const { dx: dxR, dy: dyR } = directions[Direction.RIGHT];
      stack.push({ y: y + dyL, x: x + dxL, dir: Direction.LEFT });
      stack.push({ y: y + dyR, x: x + dxR, dir: Direction.RIGHT });
    } else if (cell === Field.SPLITTER_VERTICAL && [Direction.LEFT, Direction.RIGHT].includes(dir)) {
      const { dx: dxU, dy: dyU } = directions[Direction.UP];
      const { dx: dxD, dy: dyD } = directions[Direction.DOWN];
      stack.push({ y: y + dyU, x: x + dxU, dir: Direction.UP });
      stack.push({ y: y + dyD, x: x + dxD, dir: Direction.DOWN });
    } else {
      const { dx, dy } = directions[dir];
      stack.push({ y: y + dy, x: x + dx, dir });
    }
  }

  return true;
};

const partOne = (grid: string[][], map: number[][]) => {
  return simulateBeam(grid, map);
};

const countEnergized = (map: number[][]): number => map.reduce((sum, row) => sum + row.filter(v => v > 0).length, 0);

// PART 2
const partTwo = (grid: string[][]): number => {
  let max = 0;

  const height = grid.length;
  const width = grid[0].length;

  const starts: { pos: MapPosition; dir: Direction }[] = [];

  // Top & bottom edges
  for (let x = 0; x < width; x++) {
    starts.push({ pos: { y: 0, x }, dir: Direction.DOWN });
    starts.push({ pos: { y: height - 1, x }, dir: Direction.UP });
  }

  // Left & right edges
  for (let y = 0; y < height; y++) {
    starts.push({ pos: { y, x: 0 }, dir: Direction.RIGHT });
    starts.push({ pos: { y, x: width - 1 }, dir: Direction.LEFT });
  }

  for (const { pos, dir } of starts) {
    const map = Array.from({ length: height }, () => Array(width).fill(0));
    simulateBeam(grid, map, pos, dir);
    const energized = countEnergized(map);
    if (energized > max) max = energized;
  }

  return max;
};

export function day16(day: number, test: boolean) {
  const grid = readMap(day, test);
  // printGrid(grid);

  const map = createGrid(grid.length, grid[0].length);

  // Part 1
  partOne(grid, map);
  // printGrid(map);
  const res1 = map.flat().reduce((acc, curr) => acc + (curr > 0 ? 1 : 0), 0);

  // Part 2
  const res2 = partTwo(grid);

  return {
    part1: res1,
    part2: res2,
  };
}
