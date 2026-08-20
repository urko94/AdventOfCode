import { MapPosition } from '../types';
import { readMap } from '../utils/input';
import { sum } from '../utils/utils';

const DISTANCE = 1000000;

// Calculate Manhattan distance between two points on a 2D map
const calcPath = (i: MapPosition, j: MapPosition): number => {
  return Math.abs(i.x - j.x) + Math.abs(i.y - j.y);
};
const calcDistances = (i: MapPosition, j: MapPosition, emptyColumns: number[], emptyRows: number[]): number => {
  const minX = Math.min(i.x, j.x);
  const maxX = Math.max(i.x, j.x);
  const minY = Math.min(i.y, j.y);
  const maxY = Math.max(i.y, j.y);
  const d = Math.abs(i.x - j.x) + Math.abs(i.y - j.y);

  const spacesX = emptyColumns.filter(e => minX < e && e < maxX).length;
  const spacesY = emptyRows.filter(e => minY < e && e < maxY).length;
  const diffX = spacesX > 0 ? spacesX * DISTANCE - spacesX : 0;
  const diffY = spacesY > 0 ? spacesY * DISTANCE - spacesY : 0;
  return d + diffX + diffY;
};

const addRowAtIndex = (grid: string[][], i: number) => {
  grid.splice(i, 0, Array(grid[0].length).fill('.'));
};
const addColumnAtIndex = (grid: string[][], i: number) => {
  for (let row of grid) {
    row.splice(i, 0, '.');
  }
};

export function day11(day: number, test: boolean) {
  const grid = readMap(day, test);
  const gridExpanded = readMap(day, test);

  const galaxies: MapPosition[] = [];
  grid.forEach((line, y) => {
    line.forEach((l, x) => {
      if (l === '#') {
        galaxies.push({ y, x });
      }
    });
  });

  // Part 1
  // Add rows
  for (let y = 0; y < gridExpanded.length; y++) {
    if (gridExpanded[y].every(l => l === '.')) {
      addRowAtIndex(gridExpanded, y);
      y++;
    }
  }
  // Add columns
  for (let x = 0; x < gridExpanded[0].length; x++) {
    let hasGalaxy = false;
    for (let y = 0; y < gridExpanded.length; y++) {
      if (gridExpanded[y][x] === '#') {
        hasGalaxy = true;
      }
    }
    if (!hasGalaxy) {
      addColumnAtIndex(gridExpanded, x);
      x++;
    }
  }
  const galaxiesE: MapPosition[] = [];
  gridExpanded.forEach((line, y) => {
    line.forEach((l, x) => {
      if (l === '#') {
        galaxiesE.push({ y, x });
      }
    });
  });
  const paths: number[] = [];
  for (let i = 0; i < galaxiesE.length - 1; i++) {
    for (let j = i + 1; j < galaxiesE.length; j++) {
      paths.push(calcPath(galaxiesE[i], galaxiesE[j]));
    }
  }

  // Part 2
  const emptyRows: number[] = [];
  const emptyColumns: number[] = [];
  grid.forEach((line, y) => {
    if (line.every(l => l === '.')) {
      emptyRows.push(y);
    }
  });
  for (let x = 0; x < grid[0].length; x++) {
    let hasGalaxy = false;
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] === '#') {
        hasGalaxy = true;
      }
    }
    if (!hasGalaxy) {
      emptyColumns.push(x);
    }
  }

  const distances: number[] = [];
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      distances.push(calcDistances(galaxies[i], galaxies[j], emptyColumns, emptyRows));
    }
  }

  return {
    part1: sum(paths),
    part2: sum(distances),
  };
}
