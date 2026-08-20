import { readInputLines } from '../utils/input';
import { sum, sumBigInt } from '../utils/utils';

type Card = {
  winning: Set<number>;
  mine: Set<number>;
};

const parseInput = (input: string): Card => {
  const [_, numbers] = input.replaceAll('  ', ' ').split(': ');
  const parts = numbers.split(' | ');

  return {
    winning: new Set(parts[0].split(' ').map(Number)),
    mine: new Set(parts[1].split(' ').map(Number)),
  };
};

const partOne = (card: Card): number => {
  let value = 0;
  for (const num of card.mine) {
    if (card.winning.has(num)) {
      value++;
    }
  }
  return value ? value : 0;
};

export function day04(day: number, test: boolean) {
  const lines = readInputLines(day, test);

  // Part 1
  const cards = lines.map(line => parseInput(line));
  const matches = cards.map(line => partOne(line));
  const res1 = matches.map(v => Math.pow(2, v - 1));
  // console.log(cards);
  // console.log(matches);
  // console.log(res1);

  //Part 2
  const n = matches.length;
  const copies: bigint[] = Array(n).fill(1n);

  for (let i = 0; i < n; i++) {
    for (let j = 1; j <= matches[i]; j++) {
      if (i + j < n) {
        copies[i + j] += copies[i];
      }
    }
  }
  // console.log(copies);

  return {
    part1: sum(res1),
    part2: sumBigInt(copies),
  };
}
