import { readInputLines } from '../utils/input';
import { mul } from '../utils/utils';

const partOne = (time: number, distance: number) => {
  let ways = 0;
  let hold = 0;

  while (hold < time) {
    if (hold * (time - hold) > distance) {
      ways += 1;
    }
    hold += 1;
  }
  return ways;
};

export function day06(day: number, test: boolean) {
  const [lineT, lineD] = readInputLines(day, test);
  const times = lineT.split(': ')[1].match(/\d+/g)!.map(Number);
  const distances = lineD.split(': ')[1].match(/\d+/g)!.map(Number);

  // Part 1
  const res1 = times.map((t, i) => partOne(t, distances[i]));

  // Part 2
  const time = lineT.split(': ')[1].replaceAll(' ', '');
  const distance = lineD.split(': ')[1].replaceAll(' ', '');

  const res2 = partOne(parseInt(time, 10), parseInt(distance, 10));

  return {
    part1: mul(res1),
    part2: res2,
  };
}
