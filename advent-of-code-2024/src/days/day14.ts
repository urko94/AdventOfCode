import { readInput, readInputLines } from '../utils/input';
import { printGrid } from '../utils/output';
import { createGrid } from '../utils/utils';

type Bot = {
  px: number;
  py: number;
  vx: number;
  vy: number;
};

const WIDTH = 101;
const HEIGHT = 103;
const SECONDS = 100;

class Robot {
  px: number;
  py: number;
  vx: number;
  vy: number;

  constructor(bot: Bot) {
    this.px = bot.px;
    this.py = bot.py;
    this.vx = bot.vx;
    this.vy = bot.vy;
  }

  move() {
    this.px += this.vx;
    this.py += this.vy;
    if (this.px < 0) this.px += WIDTH;
    if (this.py < 0) this.py += HEIGHT;
    if (this.px >= WIDTH) this.px -= WIDTH;
    if (this.py >= HEIGHT) this.py -= HEIGHT;
  }

  get position() {
    return [this.px, this.py];
  }

  isBound(topLeft: [number, number], bottomRight: [number, number]) {
    return topLeft[0] <= this.px && bottomRight[0] > this.px && topLeft[1] <= this.py && bottomRight[1] > this.py;
  }
}

const add = (p: number, v: number, limit: number) => {
  p += v;
  if (p < 0) {
    p += limit;
  } else if (p >= limit) {
    p -= limit;
  }
  return p;
};

const partOne = (grid: number[][], { py, px, vy, vx }: Bot) => {
  let y = py;
  let x = px;
  for (let i = 0; i < 100; i++) {
    y = add(y, vy, grid.length);
    x = add(x, vx, grid[0].length);
  }
  grid[y][x]++;
};

const sumQuadrant = (grid: number[][], y0: number, x0: number, y1: number, x1: number) => {
  let sum = 0;
  for (let i = y0; i < y1; i++) {
    for (let j = x0; j < x1; j++) {
      sum += grid[i][j];
    }
  }
  return sum;
};

const isSameLocation = (y1: number, x1: number, y2: number, x2: number) => y1 === y2 && x1 === x2;
const hasNeighbor = (actions: Bot[], y: number, x: number) => {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      if (actions.some(a => isSameLocation(a.py, a.px, y + i, x + j))) {
        return true;
      }
    }
  }
  return false;
};

const isCircle = (actions: Bot[]) => {
  for (let i = 0; i < actions.length; i++) {
    const { py, px } = actions[i];
    if (!hasNeighbor(actions, py, px)) {
      return false;
    }
  }
  return true;
};

const partTwo = (grid: number[][], actions: Bot[]) => {
  console.log(actions);
  let i = 0;
  while (!isCircle(actions) && i < 1000000000) {
    actions.forEach(action => {
      let { py, px, vy, vx } = action;
      if (grid[py][px] > 0) {
        grid[py][px]--;
      }
      action.py = add(py, vy, grid.length);
      action.px = add(px, vx, grid[0].length);
      grid[action.py][action.px]++;
    });
    i++;
  }
  console.log(i);
  console.log(actions);
  printGrid(grid);
};

/**
 * GPT
 */

const mod = (n: number, m: number) => ((n % m) + m) % m;
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

function posAt(b: Bot, t: number, W: number, H: number) {
  return {
    px: mod(b.px + b.vx * t, W),
    py: mod(b.py + b.vy * t, H),
  };
}

function bboxArea(points: { px: number; py: number }[]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const p of points) {
    if (p.px < minX) minX = p.px;
    if (p.py < minY) minY = p.py;
    if (p.px > maxX) maxX = p.px;
    if (p.py > maxY) maxY = p.py;
  }
  return (maxX - minX + 1) * (maxY - minY + 1);
}

// Check if points in 2D area form a Christmas tree shape (simple heuristic)
// This checks for a roughly symmetric triangle with a trunk
function isChristmasTreeArea(points: { px: number; py: number }[]): boolean {
  if (points.length < 5) return false;

  // Find bounding box
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of points) {
    if (p.px < minX) minX = p.px;
    if (p.px > maxX) maxX = p.px;
    if (p.py < minY) minY = p.py;
    if (p.py > maxY) maxY = p.py;
  }
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  if (height < 3 || width < 3) return false;

  // Build grid
  const grid = Array.from({ length: height }, () => Array(width).fill(0));
  for (const p of points) {
    grid[p.py - minY][p.px - minX] = 1;
  }

  // Check for triangle shape (tree)
  let center = Math.floor(width / 2);
  let treeRows = 0;
  for (let y = 0; y < height - 1; y++) {
    let left = center - y;
    let right = center + y;
    if (left < 0 || right >= width) break;
    let rowOk = true;
    for (let x = left; x <= right; x++) {
      if (grid[y][x] !== 1) rowOk = false;
    }
    if (rowOk) treeRows++;
    else break;
  }
  if (treeRows < 2) return false;

  // Check for trunk (vertical line under triangle)
  let trunkX = center;
  let trunkLen = 0;
  for (let y = treeRows; y < height; y++) {
    if (grid[y][trunkX] === 1) trunkLen++;
  }
  return trunkLen >= 1;
}

export function part2(bots: Bot[], W = 101, H = 103): number {
  const period = 1000 * lcm(W, H);

  let bestT = 0;
  let bestArea = Infinity;

  for (let t = 0; t < period; t++) {
    const pts = bots.map(b => posAt(b, t, W, H));
    const isTree = isChristmasTreeArea(pts);
    if (isTree || t % 100 === 0) {
      console.log(renderAt(bots, t, W, H));
      console.log();
    }
  }
  console.log(period);
  // console.log(renderAt(bots, bestT, W, H));
  return bestT;
}

export function renderAt(bots: Bot[], t: number, W = 101, H = 103): string {
  const grid = Array.from({ length: H }, () => Array.from({ length: W }, () => '.'));
  for (const b of bots) {
    const { px, py } = posAt(b, t, W, H);
    grid[py][px] = '#';
  }
  return grid.map(r => r.join('')).join('\n');
}

export function day14() {
  const isTest = false;
  const bots = readInputLines(14, isTest).map(l => {
    const [px, py, vx, vy] = l.match(/-?\d+/g)!.map(Number);
    return { px, py, vx, vy };
  });
  const lenX = isTest ? 11 : 101;
  const lenY = isTest ? 7 : 103;
  let lenYh = Math.floor(lenY / 2);
  let lenXh = Math.floor(lenX / 2);

  // Part 1
  console.time();
  const grid = createGrid(lenY, lenX);
  bots.forEach(b => partOne(grid, b));
  const sum1 = sumQuadrant(grid, 0, 0, lenYh, lenXh);
  const sum2 = sumQuadrant(grid, 0, lenXh + 1, lenYh, lenX);
  const sum3 = sumQuadrant(grid, lenYh + 1, 0, lenY, lenXh);
  const sum4 = sumQuadrant(grid, lenYh + 1, lenXh + 1, lenY, lenX);
  console.timeEnd();

  //Part 2
  const robots: Robot[] = [];
  bots.map(y => {
    const r = new Robot(y);
    robots.push(r);
    return y;
  });
  let res2 = 0;
  for (let i = 0; i < lcm(lenX, lenY); i++) {
    let count = 0;
    const arr = new Array(lenY);
    for (let x = 0; x < arr.length; x++) {
      arr[x] = new Array(lenX).fill('.');
    }
    robots.map(a => {
      const [x, y] = a.position;
      arr[y][x] = '#';
      if (
        a.isBound(
          [Math.floor(lenX * 0.25), Math.floor(lenY * 0.25)],
          [Math.floor(lenX * 0.75), Math.floor(lenY * 0.75)]
        )
      )
        count = count + 1;
      a.move();
    });
    if (count >= Math.floor(robots.length / 2)) {
      res2 = i;
      printGrid(arr);
      break;
    }
  }

  return {
    part1: sum1 * sum2 * sum3 * sum4,
    part2: res2,
  };
}
