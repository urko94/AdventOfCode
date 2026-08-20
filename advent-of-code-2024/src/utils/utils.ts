export const isOdd = (num: number) => num % 2 === 1;

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

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

export const isSameLocation = (a: Position, b: Position) => a[0] === b[0] && a[1] === b[1];

export const findPosition = (map: string[][], char: string): Position => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === char) {
        return [y, x];
      }
    }
  }
  throw new Error('Start position not found');
};
