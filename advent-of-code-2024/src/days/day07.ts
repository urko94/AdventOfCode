import { readInputLines } from '../utils/input';
import { printGrid, printLines } from '../utils/output';

type Line = [number, number[]];

enum Operation {
  ADD = '+',
  MUL = 'x',
  JOIN = '||',
}

const calc = (numbers: number[], i: number, j: number, operation: Operation) => {
  const x = [...numbers].slice(i, 1)[0];
  const y = numbers.splice(j, 1)[0];
  const res = operation === Operation.ADD ? x + y : operation === Operation.MUL ? x * y : parseInt(`${x}${y}`);

  numbers.splice(i, 1, res);
  return numbers;
};

const checkEquation = (result: number, numbers: number[], part2 = false): number => {
  if (numbers.length < 1) return 0;
  if (numbers[0] === result) return result;
  if (numbers.length === 1) return 0;

  for (let i = 0; i < numbers.length - 1; i++) {
    const nums1 = calc([...numbers], i, i + 1, Operation.ADD);
    const nums2 = calc([...numbers], i, i + 1, Operation.MUL);
    const nums3 = part2 ? calc([...numbers], i, i + 1, Operation.JOIN) : [];
    return (
      checkEquation(result, nums1, part2) || checkEquation(result, nums2, part2) || checkEquation(result, nums3, part2)
    );
  }
  return 0;
};

export function day07() {
  const lines: Line[] = readInputLines(7).map(l => {
    const [value, numbers] = l.split(': ');
    return [parseInt(value), numbers.split(' ').map(i => parseInt(i))];
  });
  // printLines(lines);

  // Part 1
  const res1 = lines.map(([value, numbers]) => checkEquation(value, [...numbers]));

  //Part 2
  const res2 = lines.map(([value, numbers]) => checkEquation(value, [...numbers], true));

  return {
    part1: res1.reduce((acc, curr) => acc + curr, 0),
    part2: res2.reduce((acc, curr) => acc + curr, 0),
  };
}
