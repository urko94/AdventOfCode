import { readInput } from '../utils/input';
import { sum } from '../utils/utils';

const containedParts = (word: string, parts: string[]) => parts.filter(part => word.includes(part));

let wordFound = false;
const combineWord = (word: string, parts: string[]): boolean => {
  if (wordFound) return true;
  if (word.length === 0) {
    wordFound = true;
    return true;
  }

  const availableParts = parts.filter(p => word.startsWith(p));

  if (availableParts.length === 0) return false;

  const res = availableParts.map((part: string) => {
    return combineWord(word.replace(part, ''), parts);
  });
  return res.some(Boolean);
};

const wordIsCombined = (word: string, parts: string[]) => {
  const containedParts: string[] = [];
  const chars: number[] = Array(word.length).fill(0);

  for (const part of parts) {
    if (word.includes(part)) {
      containedParts.push(part);
      for (let i = 0; i <= word.length - part.length; i++) {
        if (word.startsWith(part, i)) {
          for (let j = 0; j < part.length; j++) {
            chars[i + j]++;
          }
        }
      }
    }
  }
  if (chars.every(c => c > 0)) {
    wordFound = false;
    return combineWord(word, containedParts);
  }

  return false;
};

const countCombinations = (() => {
  const memo = new Map<string, number>();

  const helper = (word: string, parts: string[]): number => {
    if (word.length === 0) return 1;

    const key = word;
    if (memo.has(key)) return memo.get(key)!;

    let total = 0;
    for (const part of parts) {
      if (word.startsWith(part)) {
        total += helper(word.slice(part.length), parts);
      }
    }

    memo.set(key, total);
    return total;
  };

  return (word: string, parts: string[]): number => {
    memo.clear();
    return helper(word, parts);
  };
})();

export function day19(day: number, test: boolean) {
  const [i1, i2] = readInput(day, test).split('\n\n');
  const parts = i1.trim().split(', ');
  const words = i2.trim().split('\n');
  // console.log(parts.length);
  // console.log(words.length);

  // Part 1
  console.time();
  const res1 = words.filter(word => wordIsCombined(word, parts));
  console.timeEnd();
  // console.log(res1.length);

  // Part 2
  console.time();
  const res2 = words
    .slice(3, 5)
    .filter(word => wordIsCombined(word, parts))
    .map(word => countCombinations(word, containedParts(word, parts)));
  console.timeEnd();
  console.log(res2);

  return {
    part1: res1.length,
    part2: sum(res2),
  };
}
