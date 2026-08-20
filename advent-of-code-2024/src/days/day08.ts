import { readInputLines } from '../utils/input';
import { printGrid } from '../utils/output';

type Nodes = Record<string, Position[]>;

const getAntennas = (grid: string[][]): Nodes => {
  const antennas: Nodes = {};
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const curr = grid[i][j];
      if (curr !== '.' && curr !== '#') {
        if (!antennas[curr]) {
          antennas[curr] = [];
        }
        antennas[curr].push([i, j]);
      }
    }
  }
  return antennas;
};

const createCandidates = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const [dx2, dy2] = [dx * 2, dy * 2];
  return [
    [x1 - dx, x2 - dx2, y1 - dy, y2 - dy2], // left-up
    [x1 - dx, x2 - dx2, y1 + dy, y2 + dy2], // right-up
    [x1 + dx, x2 + dx2, y1 - dy, y2 - dy2], // left-down
    [x1 + dx, x2 + dx2, y1 + dy, y2 + dy2], // right-down
    [x1 - dx2, x2 - dx, y1 - dy2, y2 - dy], // left-up switched
    [x1 - dx2, x2 - dx, y1 + dy2, y2 + dy], // right-up switched
    [x1 + dx2, x2 + dx, y1 - dy2, y2 - dy], // left-down switched
    [x1 + dx2, x2 + dx, y1 + dy2, y2 + dy], // right-down switched
  ];
};

const isInsideGrid = (x: number, y: number, grid: string[][]) => {
  return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
};

const partOne = (grid: string[][]) => {
  const antinodes: Position[] = [];
  const antennas: Nodes = getAntennas(grid);

  Object.values(antennas).forEach(paths => {
    for (let i = 0; i < paths.length - 1; i++) {
      for (let j = i + 1; j < paths.length; j++) {
        const [x1, y1] = paths[i];
        const [x2, y2] = paths[j];

        const candidates = createCandidates(x1, y1, x2, y2);
        for (const [cx1, cx2, cy1, cy2] of candidates) {
          if (cx1 === cx2 && cy1 === cy2 && cx1 >= 0 && cx1 < grid.length && cy1 >= 0 && cy1 < grid[i].length) {
            antinodes.push([cx1, cy1]);
          }
        }
      }
    }
  });
  antinodes.forEach(node => {
    const [x, y] = node;
    grid[x][y] = '#';
  });

  return grid;
};

const partTwo = (grid: string[][]) => {
  const antinodes: Position[] = [];
  const antennas: Nodes = getAntennas(grid);

  Object.values(antennas).forEach(paths => {
    for (let i = 0; i < paths.length - 1; i++) {
      for (let j = i + 1; j < paths.length; j++) {
        const [x1, y1] = paths[i];
        const [x2, y2] = paths[j];
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const candidates = createCandidates(x1, y1, x2, y2);

        candidates.forEach(([cx1, cx2, cy1, cy2], candidateIndex) => {
          if (cx1 === cx2 && cy1 === cy2 && isInsideGrid(cx1, cy1, grid)) {
            let x = cx1;
            let y = cy1;

            const dxs = [-dx, -dx, dx, dx];
            const dys = [-dy, dy, -dy, dy];
            const dir = candidateIndex % 4;
            do {
              antinodes.push([x, y]);
              x += dxs[dir];
              y += dys[dir];
            } while (isInsideGrid(x, y, grid));
            return;
          }
        });
      }
    }
  });
  antinodes.forEach(node => {
    const [x, y] = node;
    grid[x][y] = '#';
  });

  return antinodes;
};

export function day08() {
  const grid = readInputLines(8).map(l => l.split(''));
  const grid1 = readInputLines(8).map(l => l.split(''));

  // Part 1
  partOne(grid);

  //Part 2
  partTwo(grid1);
  printGrid(grid1);

  return {
    part1: grid.flat().filter(c => c === '#').length,
    part2: grid1.flat().filter(c => c != '.').length,
  };
}
