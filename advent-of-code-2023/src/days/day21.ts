import { off } from 'process';
import { Direction, directions, MapPosition, Grid } from '../types';
import { readMap } from '../utils/input';
import { printGrid } from '../utils/output';
import { cloneArray, findPosition, findPositions, mod } from '../utils/utils';

enum Field {
  START = 'S',
  GARDEN = '.',
  ROCKS = '#',
  TILE = 'O',
}

const swapPositions = (map: Grid, positions: MapPosition[]): Grid => {
  for (let p of positions) {
    map[p.y][p.x] = Field.GARDEN;

    for (let d in directions) {
      let key = Number(d) as Direction;
      const { dy, dx } = directions[key];
      const newY = p.y + dy;
      const newX = p.x + dx;
      if (newY >= 0 && newY < map.length && newX >= 0 && newX < map[newY].length && map[newY][newX] !== Field.ROCKS) {
        map[newY][newX] = Field.TILE;
      }
    }
  }
  return map;
};

const partOne = (grid: Grid, loops: number) => {
  const start = findPosition(grid, Field.START);
  let positions = [start];
  const lengths: number[] = [];

  for (let i = 0; i < loops; i++) {
    swapPositions(grid, positions);
    positions = findPositions(grid, Field.TILE);

    if (lengths.includes(positions.length) && lengths.filter(v => v === positions.length).length > 3) {
      lengths.push(positions.length);
      let startDiff = lengths.findIndex(v => v === positions.length);
      let diff = 1;
      while (diff < lengths.length && lengths[lengths.length - 1 - diff] != positions.length) {
        diff++;
      }
      if (Math.floor((loops - startDiff - 1) % diff) === 0) {
        return positions.length;
      }
    } else {
      lengths.push(positions.length);
    }
  }
  return positions.length;
};

const partTwo = (grid: Grid, size: number, steps: number): number => {
  const offset = Math.floor(size / 2);

  // Run 3 simulations to fit a quadratic
  const results = [
    partOne(cloneArray(grid), offset),
    partOne(cloneArray(grid), offset + size),
    partOne(cloneArray(grid), offset + 2 * size),
  ];

  const a = (results[2] - 2 * results[1] + results[0]) / 2;
  const b = results[1] - results[0] - a;
  const c = results[0];

  const n = Math.floor((steps - offset) / size);

  return a * n * n + b * n + c;
};

const scaleGrid = (grid: Grid) => {
  const start = findPosition(grid, Field.START);
  grid[start.y][start.x] = Field.GARDEN;
  const grid2 = grid.map(l => [...l, ...l, ...l]);
  const grid3 = [...cloneArray(grid2), ...cloneArray(grid2), ...cloneArray(grid2)];
  grid3[grid.length + start.y][grid[0].length + start.x] = Field.START;
  return grid3;
};
export function day21(day: number, test: boolean) {
  const grid = readMap(day, test);

  // Part 1
  console.time();
  const res1 = partOne(cloneArray(grid), 64);
  console.timeEnd();

  // Part 2
  const grid2 = scaleGrid(grid);
  const grid3 = scaleGrid(grid2);
  const grid4 = scaleGrid(grid3);
  const grid5 = scaleGrid(grid4);

  console.time();
  const res2 = partTwo(grid5, grid.length, 26501365);
  console.timeEnd();

  return {
    part1: res1,
    part2: res2,
  };
}
