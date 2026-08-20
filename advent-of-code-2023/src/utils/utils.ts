import { Direction, DirectionDiff, directions, MapPosition, Position } from '../types';

export const isOdd = (num: number) => num % 2 === 1;

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
export const sumPositive = (arr: number[]) => arr.reduce((a, b) => (b > 0 ? a + b : a), 0);
export const sumBigInt = (arr: bigint[]) => arr.reduce((a, b) => a + b, 0n);
export const mul = (arr: number[]) => arr.reduce((a, b) => a * b, 1);
export const mod = (n: number, d: number) => n % d;
export const max = (arr: number[]) => Math.max(...arr);

export const getLastIdIdx = (data: number[]) =>
  data.length -
  1 -
  data
    .slice()
    .reverse()
    .findIndex(d => d !== -1);

export const rearrangeBlokcsForEach = (blocks: number[]) => {
  return blocks.forEach((curr: number, idx: number) => {
    if (curr === -1) {
      const lastIdx = getLastIdIdx(blocks);
      if (lastIdx > idx) {
        blocks[idx] = blocks[lastIdx];
        blocks[lastIdx] = -1;
      }
    }
  });
};

export const rearrangeBlokcsReduce = (blocks: number[]) => {
  return blocks.reduce((acc: number[], curr: number, idx: number) => {
    if (curr === -1) {
      const lastIdx = getLastIdIdx(blocks);
      if (lastIdx > idx) {
        acc.push(blocks[lastIdx]);
        blocks[lastIdx] = -1;
      } else {
        acc.push(curr);
      }
      return acc;
    }
    acc.push(curr);
    return acc;
  }, []);
};

export function checksumAfterCompaction(diskMap: string): number {
  // Build the block array: -1 = free, >=0 = file ID
  const blocks: number[] = [];
  let fileId = 0;

  for (let i = 0; i < diskMap.length; i++) {
    const len = diskMap.charCodeAt(i) - 48; // fast '0'..'9' -> 0..9
    if (i % 2 === 0) {
      // file run
      for (let k = 0; k < len; k++) blocks.push(fileId);
      fileId++;
    } else {
      // free run
      for (let k = 0; k < len; k++) blocks.push(-1);
    }
  }

  // Two-pointer compaction: move rightmost file blocks into leftmost gaps
  let L = 0;
  let R = blocks.length - 1;

  // find first free from left
  while (L < blocks.length && blocks[L] !== -1) L++;
  // find first file from right
  while (R >= 0 && blocks[R] === -1) R--;

  while (L < R) {
    // move the block
    blocks[L] = blocks[R];
    blocks[R] = -1;

    // advance L to next free
    do {
      L++;
    } while (L < R && blocks[L] !== -1);
    // retreat R to next file
    do {
      R--;
    } while (R > L && blocks[R] === -1);
  }
  console.log(blocks.filter(b => b >= 0).join(''));

  // checksum
  let sum = 0;
  for (let i = 0; i < blocks.length; i++) {
    const id = blocks[i];
    if (id >= 0) sum += i * id;
  }
  return sum;
}

export const createArray = (lenX: number) => {
  return Array(lenX).fill(0);
};
export const cloneArray = <T>(a: Array<Array<T>>): Array<Array<T>> => {
  return [...a.map(l => [...l])];
};
export const createGrid = (lenY: number, lenX: number) => {
  return Array(lenY)
    .fill([])
    .map(_ => Array(lenX).fill(0));
};

// Največji skupni delitelj (Greatest Common Divisor - GCD)
export const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

// Najmanjši skupni večkratnik (Least Common Multiple - LCM)
export const lcm = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
};
export const lcmArray = (arr: number[]): number => {
  return arr.reduce((acc, curr) => lcm(acc, curr), 1);
};

export const isSamePosition = (a: MapPosition, b: MapPosition) => a.y === b.y && a.x === b.x;

export const findPosition = (map: string[][], char: string): MapPosition => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === char) {
        return { y, x };
      }
    }
  }
  throw new Error('Start position not found');
};

export const findPositions = (map: string[][], char: string): MapPosition[] => {
  const positions = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === char) {
        positions.push({ y, x });
      }
    }
  }
  return positions;
};

export function replaceAt(str: string, index: number, replacement: string): string {
  return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}
export function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

export function matrixToString<T>(matrix: T[][]): string {
  return matrix.map(l => l.join('')).join('');
}

export function transpose<T>(matrix: T[][]): T[][] {
  return Array.from({ length: matrix[0].length }, (_, i) => matrix.map(row => row[i]));
}

export function rotateMatrix<T>(matrix: T[][], direction: 'cw' | 'ccw' | 180 = 'cw'): T[][] {
  const n = matrix.length;
  const m = matrix[0].length;

  // rotate clockwise 90°
  if (direction === 'cw') {
    return Array.from({ length: m }, (_, c) => Array.from({ length: n }, (_, r) => matrix[n - 1 - r][c]));
  }

  // rotate counterclockwise 90°
  if (direction === 'ccw') {
    return Array.from({ length: m }, (_, c) => Array.from({ length: n }, (_, r) => matrix[r][m - 1 - c]));
  }

  // rotate 180°
  return matrix.map(row => [...row].reverse()).reverse();
}

export const getDirections = (dir?: string): Record<string, DirectionDiff> => {
  if (!dir) return directions;

  const { dx, dy } = directions[Number(dir) as Direction];

  return Object.entries(directions)
    .filter(([key, value]: [string, DirectionDiff]) => key && !(value.dx === -1 * dx && value.dy === -1 * dy))
    .reduce(
      (acc: Record<string, DirectionDiff>, value: any) => {
        acc[value[0]] = value[1];
        return acc;
      },
      {} as Record<string, DirectionDiff>
    );
};
