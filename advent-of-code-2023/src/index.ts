import { day01 } from './days/day01';
import { day02 } from './days/day02';
import { day03 } from './days/day03';
import { day04 } from './days/day04';
import { day05 } from './days/day05';
import { day06 } from './days/day06';
import { day07 } from './days/day07';
import { day08 } from './days/day08';
import { day09 } from './days/day09';
import { day10 } from './days/day10';
import { day11 } from './days/day11';
import { day12 } from './days/day12';
import { day13 } from './days/day13';
import { day14 } from './days/day14';
import { day15 } from './days/day15';
import { day16 } from './days/day16';
import { day17 } from './days/day17';
import { day18 } from './days/day18';
import { day19 } from './days/day19';
import { day20 } from './days/day20';
import { day21 } from './days/day21';
import { day22 } from './days/day22';
import { day23 } from './days/day23';
import { day24 } from './days/day24';
import { day25 } from './days/day25';

const solutions: Record<number, any> = {
  1: day01,
  2: day02,
  3: day03,
  4: day04,
  5: day05,
  6: day06,
  7: day07,
  8: day08,
  9: day09,
  10: day10,
  11: day11,
  12: day12,
  13: day13,
  14: day14,
  15: day15,
  16: day16,
  17: day17,
  18: day18,
  19: day19,
  20: day20,
  21: day21,
  22: day22,
  23: day23,
  24: day24,
  25: day25,
};

const day = Number(process.argv[2] ?? 1);
const test = Boolean(process.argv[3] ?? false);

if (solutions[day]) {
  const { part1, part2 } = solutions[day](day, test);
  console.log(`Day ${day} Part 1:`, part1);
  console.log(`Day ${day} Part 2:`, part2);
} else {
  console.error(`No solution found for day ${day}`);
}
