import { readColumns, readInputLines } from '../utils/input';

const CODE = 'XMAS';

const partOneReq = (textMap: string[][], x: number, y: number, step: number, direction = 0): number => {
  // Out of map
  if (x < 0 || y < 0 || x >= textMap.length || y >= textMap[x].length) {
    return 0;
  }
  // wrogn step or wrong char
  if (step < 0 || step >= CODE.length || textMap[x][y] !== CODE[step]) {
    return 0;
  }
  if (step === CODE.length - 1 && textMap[x][y] === CODE[step]) {
    return 1;
  }

  if (direction === 1) return partOneReq(textMap, x - 1, y - 1, step + 1, 1);
  if (direction === 2) return partOneReq(textMap, x, y - 1, step + 1, 2);
  if (direction === 3) return partOneReq(textMap, x + 1, y - 1, step + 1, 3);
  if (direction === 4) return partOneReq(textMap, x - 1, y, step + 1, 4);
  if (direction === 5) return partOneReq(textMap, x + 1, y, step + 1, 5);
  if (direction === 6) return partOneReq(textMap, x - 1, y + 1, step + 1, 6);
  if (direction === 7) return partOneReq(textMap, x, y + 1, step + 1, 7);
  if (direction === 8) return partOneReq(textMap, x + 1, y + 1, step + 1, 8);

  return (
    partOneReq(textMap, x - 1, y - 1, step + 1, 1) +
    partOneReq(textMap, x, y - 1, step + 1, 2) +
    partOneReq(textMap, x + 1, y - 1, step + 1, 3) +
    partOneReq(textMap, x - 1, y, step + 1, 4) +
    partOneReq(textMap, x + 1, y, step + 1, 5) +
    partOneReq(textMap, x - 1, y + 1, step + 1, 6) +
    partOneReq(textMap, x, y + 1, step + 1, 7) +
    partOneReq(textMap, x + 1, y + 1, step + 1, 8)
  );
};

const partOne = (textMap: string[][]) => {
  const results: number[][] = [];

  for (let i = 0; i < textMap.length; i++) {
    results[i] = [];
    for (let j = 0; j < textMap[i].length; j++) {
      results[i][j] = partOneReq(textMap, i, j, 0);
    }
  }
  return results.flatMap(i => i).reduce((acc, curr) => acc + curr, 0);
};

export function day04() {
  const textMap = readInputLines(4).map(line => line.split(''));
  const lines = readInputLines(4);
  const linesReversed = lines.map(line => line.split('').reverse().join(''));
  const columns = readColumns(4).map(col => col.join(''));
  const columnsReversed = columns.map(col => col.split('').reverse().join(''));

  // Part 1
  const res = partOne(textMap);
  const diagonal: Record<number, string[]> = {};
  const diagonalBack: Record<number, string[]> = {};

  // Collect diagonals (top-left to bottom-right)
  for (let d = 0; d < textMap.length + textMap[0].length - 1; d++) {
    diagonal[d] = [];
    for (let i = 0; i < textMap.length; i++) {
      let j = d - i;
      if (j >= 0 && j < textMap[0].length) {
        diagonal[d].push(textMap[i][j]);
      }
    }
  }

  // Collect anti-diagonals (bottom-left to top-right)
  for (let d = 0; d < textMap.length + textMap[0].length - 1; d++) {
    diagonalBack[d] = [];
    for (let i = 0; i < textMap.length; i++) {
      let j = d - (textMap.length - 1 - i);
      if (j >= 0 && j < textMap[0].length) {
        diagonalBack[d].push(textMap[i][j]);
      }
    }
  }

  const diagonalStrings = Object.values(diagonal)
    .filter(str => str.length > 3)
    .map(str => str.join(''));
  const diagonalBackStrings = Object.values(diagonalBack)
    .filter(str => str.length > 3)
    .map(str => str.join(''));

  const diagonalStringsReversed = diagonalStrings.map(str => str.split('').reverse().join(''));
  const diagonalBackStringsReversed = diagonalBackStrings.map(str => str.split('').reverse().join(''));
  const regex = /XMAS/g;
  const allStrings = [
    ...lines,
    ...linesReversed,
    ...columns,
    ...columnsReversed,
    ...diagonalStrings,
    ...diagonalBackStrings,
    ...diagonalStringsReversed,
    ...diagonalBackStringsReversed,
  ];

  const res1 = allStrings.reduce((acc, str) => {
    const matches = typeof str === 'string' ? str.match(regex) : null;
    return acc + (matches ? matches.length : 0);
  }, 0);

  //Part 2
  const isXMas = (textMap: string[][], i: number, j: number) =>
    textMap[i][j] === 'A' &&
    ((textMap[i - 1][j - 1] === 'M' && textMap[i + 1][j + 1] === 'S') ||
      (textMap[i - 1][j - 1] === 'S' && textMap[i + 1][j + 1] === 'M')) &&
    ((textMap[i + 1][j - 1] === 'M' && textMap[i - 1][j + 1] === 'S') ||
      (textMap[i + 1][j - 1] === 'S' && textMap[i - 1][j + 1] === 'M'));

  let res2 = 0;
  for (let i = 1; i < textMap.length - 1; i++) {
    for (let j = 1; j < textMap[i].length - 1; j++) {
      if (isXMas(textMap, i, j)) {
        res2++;
      }
    }
  }

  return {
    part1: res1,
    part2: res2,
  };
}
