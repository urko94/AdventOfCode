import { parse } from 'path';
import { readInput, readInputLines } from '../utils/input';
import { printGrid, printLines } from '../utils/output';
import { sum } from '../utils/utils';

export function day03(day: number, test: boolean) {
  const input = readInputLines(day, test).map(line => line.split(''));
  const grid = Array.from({ length: input.length }, () => Array(input[0].length).fill(0));

  // Part 1
  input.forEach((line, y) => {
    line.forEach((char, x) => {
      if (parseInt(char) >= 0) {
      } else if (char !== '.') {
        grid[y][x] = 1;
        if (y > 0) grid[y - 1][x] = 1;
        if (y < grid.length - 1) grid[y + 1][x] = 1;
        if (x > 0) grid[y][x - 1] = 1;
        if (x < grid[0].length - 1) grid[y][x + 1] = 1;
        if (y > 0 && x > 0) grid[y - 1][x - 1] = 1;
        if (y > 0 && x < grid[0].length - 1) grid[y - 1][x + 1] = 1;
        if (y < grid.length - 1 && x > 0) grid[y + 1][x - 1] = 1;
        if (y < grid.length - 1 && x < grid[0].length - 1) grid[y + 1][x + 1] = 1;
      }
    });
  });

  const numbers = readInput(day, test).match(/\d+/g)!.map(Number);
  // printGrid(input);
  // printGrid(grid);
  // console.log(numbers);

  let numIdx = 0;
  const resNums = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (parseInt(input[i][j]) >= 0) {
        let added = false;
        while (parseInt(input[i][j]) >= 0 && j < input[i].length) {
          if (grid[i][j] === 1 && !added && numIdx in numbers) {
            resNums.push(numbers[numIdx]);
            added = true;
          }
          j++;
        }
        numIdx++;
      }
    }
  }

  // Data structures
  type NumInfo = { id: number; value: number; coords: Array<[number, number]> };

  const nums: NumInfo[] = [];
  const coordToNum = new Map<string, number>();

  // 1) Find all horizontal numbers (multi-digit allowed)
  let id = 0;
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    let x = 0;
    while (x < row.length) {
      if (/\d/.test(row[x])) {
        const start = x;
        let numStr = row[x];
        x++;
        while (x < row.length && /\d/.test(row[x])) {
          numStr += row[x];
          x++;
        }
        const val = Number(numStr);
        const coords: Array<[number, number]> = [];
        for (let xx = start; xx < start + numStr.length; xx++) {
          coords.push([y, xx]);
          coordToNum.set(`${y},${xx}`, id);
        }
        nums.push({ id, value: val, coords });
        id++;
      } else {
        x++;
      }
    }
  }

  // Part 2
  const deltas = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  let total = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === '*') {
        const seen = new Set<number>();
        for (const [dy, dx] of deltas) {
          const ny = y + dy,
            nx = x + dx;
          if (ny >= 0 && ny < input.length && nx >= 0 && nx < input[0].length) {
            const key = `${ny},${nx}`;
            if (coordToNum.has(key)) seen.add(coordToNum.get(key)!);
          }
        }
        if (seen.size === 2) {
          const [aId, bId] = Array.from(seen);
          const product = nums[aId].value * nums[bId].value;
          total += product;
        }
      }
    }
  }

  return {
    part1: sum(resNums),
    part2: total,
  };
}
