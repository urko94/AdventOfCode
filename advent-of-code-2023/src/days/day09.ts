import { readInputLines } from '../utils/input';
import { printGrid, printLines } from '../utils/output';
import { sum } from '../utils/utils';

const isLastLine = (line: number[]) => (line?.length && line.every(num => num === 0) ? true : false);

const partOne = (line: number[]) => {
  const stack: Record<number, number[]> = {
    0: line,
  };
  let i = 0;

  while (!isLastLine(stack[i])) {
    const newLine = [];
    for (let j = 0; j < stack[i].length - 1; j++) {
      newLine.push(Number(stack[i][j + 1] - stack[i][j] || 0));
    }
    i++;
    stack[i] = newLine;
  }
  for (let k = i - 1; k >= 0; k--) {
    stack[k].push(stack[k][stack[k].length - 1] + stack[k + 1][stack[k + 1].length - 1]);
  }

  return stack[0][stack[0].length - 1];
};
const partTwo = (line: number[]) => {
  const stack: Record<number, number[]> = {
    0: line,
  };
  let i = 0;

  while (!isLastLine(stack[i])) {
    const newLine = [];
    for (let j = 0; j < stack[i].length - 1; j++) {
      newLine.push(Number(stack[i][j + 1] - stack[i][j] || 0));
    }
    i++;
    stack[i] = newLine;
  }
  for (let k = i - 1; k >= 0; k--) {
    stack[k].unshift(stack[k][0] - stack[k + 1][0]);
  }

  return stack[0][0];
};

export function day09(day: number, test: boolean) {
  const lines = readInputLines(day, test);
  const data = lines.map(line => line.split(' ').map(Number));

  // Part 1
  const res1 = data.map(line => partOne(line));

  //Part 2
  const res2 = data.map(line => partTwo(line));

  return {
    part1: sum(res1),
    part2: sum(res2),
  };
}
