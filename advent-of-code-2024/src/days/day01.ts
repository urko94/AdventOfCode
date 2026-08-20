import { readColumnsNumeric } from '../utils/input';
import { sum } from '../utils/utils';

export function day01() {
  const [col1, col2] = readColumnsNumeric(1);

  //Part 2
  const res2 = col1.map((value: number) => (col2.filter((val: number) => val === value) || []).length * value);

  // Part 1
  col1.sort((a: number, b: number) => a - b);
  col2.sort((a: number, b: number) => a - b);
  const diff = col1.map((value: number, index: number) => Math.abs(value - col2[index]));

  return {
    part1: sum(diff),
    part2: sum(res2),
  };
}
