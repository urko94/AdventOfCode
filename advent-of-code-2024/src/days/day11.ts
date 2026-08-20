import { readInput } from '../utils/input';

const isEvenLength = (num: bigint) => `${num}`.length % 2 === 0;

const blink = (numbers: bigint[]) =>
  numbers.reduce((acc: bigint[], curr: bigint) => {
    if (curr === 0n) {
      acc.push(1n);
    } else if (isEvenLength(curr)) {
      const str = `${curr}`;
      const mid = str.length / 2;
      const first = str.slice(0, mid);
      const second = str.slice(mid);
      acc.push(BigInt(first));
      acc.push(BigInt(second));
    } else {
      acc.push(curr * 2024n);
    }
    return acc;
  }, []);

function blinkMap(stones: Map<bigint, bigint>): Map<bigint, bigint> {
  const newStones = new Map<bigint, bigint>();
  for (const [value, count] of stones) {
    if (value === 0n) {
      newStones.set(1n, (newStones.get(1n) ?? 0n) + count);
      continue;
    }
    const str = `${value}`;
    if (str.length % 2 === 0) {
      const mid = str.length / 2;
      const left = BigInt(str.slice(0, mid));
      const right = BigInt(str.slice(mid));
      newStones.set(left, (newStones.get(left) ?? 0n) + count);
      newStones.set(right, (newStones.get(right) ?? 0n) + count);
    } else {
      const newValue = value * 2024n;
      newStones.set(newValue, (newStones.get(newValue) ?? 0n) + count);
    }
  }
  return newStones;
}

export function day11() {
  const numbers = readInput(11)
    .split(' ')
    .map(i => BigInt(i));

  // Part 1
  let n = [...numbers];
  for (let i = 0; i < 25; i++) {
    n = blink(n);
  }

  //Part 2
  let stones = new Map<bigint, bigint>();
  for (const n of numbers) {
    stones.set(n, (stones.get(n) ?? 0n) + 1n);
  }
  for (let i = 0; i < 75; i++) {
    stones = blinkMap(stones);
  }
  const part2 = [...stones.values()].reduce((a, b) => a + b, 0n);

  return {
    part1: n.length,
    part2: part2,
  };
}
