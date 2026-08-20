import { Direction, directions, MapPosition } from '../types';
import { readInputLines } from '../utils/input';
import { writeToFile } from '../utils/output';
import { createGrid, getDirections, sumPositive } from '../utils/utils';

const getDirection = (d: string): Direction => {
  switch (d) {
    case 'U':
      return Direction.UP;
    case 'L':
      return Direction.LEFT;
    case 'R':
      return Direction.RIGHT;
    default:
      return Direction.DOWN;
  }
};

const getDirection2 = (d: string): Direction => {
  switch (d) {
    case '0':
      return Direction.RIGHT;
    case '1':
      return Direction.DOWN;
    case '2':
      return Direction.LEFT;
    default:
      return Direction.UP;
  }
};

const fieldFenced = (map: number[][], y: number, x: number) => {
  let down = 0,
    up = 0,
    left = 0,
    right = 0;

  for (let j = y - 1; j >= 0; j--) {
    if (map[j][x] === 1) up++;
    if (map[j][x] === -1 && up === 0) return false;
  }
  if (up === 0) return false;

  for (let j = y + 1; j < map.length; j++) {
    if (map[j][x] === 1) down++;
    if (map[j][x] === -1 && down === 0) return false;
  }
  if (down === 0) return false;

  for (let i = x - 1; i >= 0; i--) {
    if (map[y][i] === 1) left++;
    if (map[y][i] === -1 && left === 0) return false;
  }
  if (left === 0) return false;

  for (let i = x + 1; i < map[y].length; i++) {
    if (map[y][i] === 1) right++;
    if (map[y][i] === -1 && right === 0) return false;
  }
  if (right === 0) return false;

  return true;
};

const fillEmpty = (map: number[][], startPos: MapPosition = { y: 0, x: 0 }, startDir: Direction = Direction.RIGHT) => {
  const stack: { y: number; x: number; dir: Direction }[] = [{ ...startPos, dir: startDir }];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const { y, x, dir } = stack.pop()!;
    if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) continue;
    if (map[y][x] === -1 || map[y][x] === 1) continue;

    const key = `${y},${x},${dir}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (map[y][x] === 0) map[y][x] = -1;

    const dirs = getDirections(dir ? dir?.toString() : undefined);
    for (const d in dirs) {
      const { dy, dx } = dirs[d];
      const newDir = Number(d) as Direction;
      stack.push({ y: y + dy, x: x + dx, dir: newDir });
    }
  }
};

const fillFields = (map: number[][]) => {
  map.forEach((line, y) => {
    line.forEach((v, x) => {
      if (y === 0 || x === 0 || y === map.length - 1 || x === line.length - 1) {
        // continue;
      } else if (map[y][x] === 0 && fieldFenced(map, y, x)) {
        map[y][x] = 1;
      }
    });
  });
};

const partOne = (lines: string[]) => {
  const pos: MapPosition = { y: 0, x: 0 };
  const positions: MapPosition[] = [pos];
  let minY = 0,
    maxY = 0,
    minX = 0,
    maxX = 0;

  lines.forEach(l => {
    const [d, len] = l.split(' ');
    const direction = getDirection(d);
    const { dy, dx } = directions[direction];

    for (let i = 0; i < Number(len); i++) {
      pos.y += dy;
      pos.x += dx;
      positions.push({ y: pos.y, x: pos.x });

      if (pos.y < minY) minY = pos.y;
      if (pos.y > maxY) maxY = pos.y;
      if (pos.x < minX) minX = pos.x;
      if (pos.x > maxX) maxX = pos.x;
    }
  });
  const map = createGrid(Math.abs(minY) + maxY + 1, Math.abs(minX) + maxX + 1);

  positions.forEach(p => {
    map[Math.abs(minY) + p.y][Math.abs(minX) + p.x] = 1;
  });

  // printMap(map, 2);
  fillEmpty(map, { y: 0, x: 0 });
  fillEmpty(map, { y: map.length - 1, x: 0 });
  fillEmpty(map, { y: 0, x: map[0].length - 1 });
  fillEmpty(map, { y: map.length - 1, x: map[0].length - 1 });

  console.log(sumPositive(map.flat()));
  fillFields(map);
  console.log(sumPositive(map.flat()));
  writeToFile(map, 'day18.txt');

  return sumPositive(map.flat());
};

const partTwo = (lines: string[]) => {
  const pos: MapPosition = { y: 0, x: 0 };
  const positions: MapPosition[] = [pos];
  let perimeter = 0;

  lines.forEach(l => {
    const [_, __, hex] = l.split(' ');
    const len = Number(`0x${hex.slice(2, hex.length - 2)}`);
    const direction = getDirection2(hex[7]);
    const { dy, dx } = directions[direction];

    perimeter += len;
    pos.y += dy * len;
    pos.x += dx * len;
    positions.push({
      y: pos.y,
      x: pos.x,
    });
  });

  let area = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    const p1 = positions[i];
    const p2 = positions[i + 1];
    area += p1.x * p2.y - p1.y * p2.x;
  }
  area = Math.abs(area) / 2;
  return area + perimeter / 2 + 1;
};

export function day18(day: number, test: boolean) {
  const lines = readInputLines(day, test);

  // Part 1
  const res1 = partOne(lines);

  // Part 2
  const res2 = partTwo(lines);

  return {
    part1: res1,
    part2: res2,
  };
}
