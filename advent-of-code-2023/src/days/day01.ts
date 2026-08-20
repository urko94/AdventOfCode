import { readInputLines } from '../utils/input';
import { sum } from '../utils/utils';

const nums = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const firstNumInString = (s: string) => {
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i);
    if (c >= '0' && c <= '9') {
      return parseInt(c, 10);
    }
    const subS = s.substring(i);
    const idx = nums.findIndex(num => subS.startsWith(num));
    if (idx !== -1) {
      return idx + 1;
    }
  }
  return 0;
};
const lastNumInString = (s: string) => {
  for (let i = s.length - 1; i >= 0; i--) {
    const c = s.charAt(i);
    if (c >= '0' && c <= '9') {
      return parseInt(c, 10);
    }
    const subS = s.substring(0, i + 1);
    const idx = nums.findIndex(num => subS.endsWith(num));
    if (idx !== -1) {
      return idx + 1;
    }
  }
  return 0;
};

const firstDigitInString = (s: string) => {
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i);
    if (c >= '0' && c <= '9') {
      return parseInt(c, 10);
    }
  }
  return 0;
};
const lastDigitInString = (s: string) => {
  for (let i = s.length - 1; i >= 0; i--) {
    const c = s.charAt(i);
    if (c >= '0' && c <= '9') {
      return parseInt(c, 10);
    }
  }
  return 0;
};
const firstLastNumInString = (s: string) => {
  const match = s.match(/-?\d+/g);
  return match ? [parseInt(match[0], 10), parseInt(match[match.length - 1], 10)] : [null, null];
};

export function day01(day: number, test: boolean) {
  const lines = readInputLines(day, test);

  // Part 1
  const res1 = lines.map(line => {
    const n1 = firstDigitInString(line);
    const n2 = lastDigitInString(line);
    const [n3, n4] = firstLastNumInString(line);
    return Number(`${n1}${n2}`);
  });

  // Part 2
  const res2 = lines.map(line => {
    const n1 = firstNumInString(line);
    const n2 = lastNumInString(line);
    return Number(`${n1}${n2}`);
  });

  return {
    part1: sum(res1),
    part2: sum(res2),
  };
}
