import path from 'path';
import { Worker } from 'worker_threads';
import { parseNumbers, readInputLines } from '../utils/input';
import { arraysEqual, replaceAt, sum } from '../utils/utils';

export enum Spring {
  OPERATIONAL = '.',
  DAMAGED = '#',
  UNKNOWN = '?',
}

export type Record = {
  springs: string;
  arrangement: number[];
};

export const isValid = (springs: string, arrangement: number[]): boolean => {
  const arr: number[] = [];
  let seq = 0;
  for (let s of springs) {
    if (s === Spring.DAMAGED) {
      seq++;
    } else if (seq > 0) {
      arr.push(seq);
      seq = 0;
    }
  }
  if (seq > 0) {
    arr.push(seq);
  }
  const equal = arraysEqual(arr, arrangement);
  if (equal) {
    // console.log(JSON.stringify(arr));
  }
  return equal;
};
export const isPartInvalid = (springs: string, arrangement: number[]): boolean => {
  const arr: number[] = [];
  let seq = 0;
  for (let s of springs) {
    if (s === Spring.UNKNOWN) {
      break;
    } else if (s === Spring.DAMAGED) {
      seq++;
    } else if (s === Spring.OPERATIONAL && seq > 0) {
      arr.push(seq);
      seq = 0;
    }
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== arrangement[i]) return true;
  }

  return false;
};

const partOne = (springs: string, arrangement: number[]): number => {
  if (springs.includes(Spring.UNKNOWN)) {
    const idx = springs.indexOf(Spring.UNKNOWN);
    return (
      partOne(replaceAt(springs, idx, Spring.DAMAGED), arrangement) +
      partOne(replaceAt(springs, idx, Spring.OPERATIONAL), arrangement)
    );
  }

  return isValid(springs, arrangement) ? 1 : 0;
};

const partTwo = (r: Record): number => {
  const partTwoRec = (springs: string, arrangement: number[], depth = 0): number => {
    if (!springs.includes(Spring.UNKNOWN)) {
      return isValid(springs, arrangement) ? 1 : 0;
    } else if (depth > 5 && isPartInvalid(springs, arrangement)) {
      return 0;
    } else {
      const idx = springs.indexOf(Spring.UNKNOWN);

      return (
        partTwoRec(replaceAt(springs, idx, Spring.DAMAGED), arrangement, depth + 1) +
        partTwoRec(replaceAt(springs, idx, Spring.OPERATIONAL), arrangement, depth + 1)
      );
    }
  };

  return partTwoRec(r.springs, r.arrangement);
};

export async function runPartTwo(records: Record[]): Promise<number[]> {
  return Promise.all(
    records.map(
      (r, i) =>
        new Promise<number>((resolve, reject) => {
          console.time(`part ${i}`);
          const worker = new Worker(path.resolve(__dirname, '../worker/day12.ts'), {
            execArgv: ['-r', 'ts-node/register'],
          });
          worker.postMessage(r);
          worker.on('message', (res: number) => {
            console.timeEnd(`part ${i}`);
            resolve(res);
            worker.terminate();
          });
          worker.on('error', reject);
        })
    )
  );
}

const countArrangements = (record: Record): number => {
  const memo = new Map<string, number>();
  const { springs, arrangement } = record;

  const dfs = (i: number, j: number, run: number): number => {
    const key = `${i},${j},${run}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    if (i === springs.length) {
      // End of string: valid if we consumed all groups
      const valid = (j === arrangement.length && run === 0) || (j === arrangement.length - 1 && run === arrangement[j]);
      return valid ? 1 : 0;
    }

    let total = 0;
    const ch = springs[i];

    // Option 1: place an operational (.)
    if (ch !== '#') {
      if (run === 0) {
        total += dfs(i + 1, j, 0);
      } else if (j < arrangement.length && run === arrangement[j]) {
        total += dfs(i + 1, j + 1, 0);
      }
    }

    // Option 2: place a damaged (#)
    if (ch !== '.') {
      total += dfs(i + 1, j, run + 1);
    }

    memo.set(key, total);
    return total;
  };

  const r = dfs(0, 0, 0);
  // Array.from(memo.entries()).forEach(i => console.log(i));
  return r;
};

export async function day12(day: number, test: boolean) {
  const lines = readInputLines(day, test);
  const records: Record[] = lines.map(line => {
    const [springs, numbers] = line.split(' ');
    return {
      springs,
      arrangement: parseNumbers(numbers, ','),
    };
  });

  // Part 1
  console.time();
  const res1 = records.map(r => partOne(r.springs, r.arrangement));
  console.timeEnd();

  // Part 2
  console.time();
  const records2: Record[] = lines.slice(0, 50).map(line => {
    const [s, n] = line.split(' ');
    const arr = parseNumbers(n, ',');
    let springs: string = '';
    let arrangement: number[] = [];
    for (let i = 0; i < 5; i++) {
      springs += s + (i < 4 ? '?' : '');
      arrangement = [...arrangement, ...arr];
    }
    return {
      springs,
      arrangement,
    };
  });

  // const res2 = records2.map((r, i) => {
  //   console.time(`part ${i}`);
  //   const re = countArrangements(r);
  //   console.timeEnd(`part ${i}`);
  //   return re;
  // });
  let res2: number[] = [];
  while (records2.length) {
    const res = await runPartTwo(records2.splice(0, 8));
    res2 = [...res2, ...res];
  }
  console.log(res2);
  console.timeEnd();

  return {
    part1: sum(res1),
    part2: sum(res2),
  };
}
