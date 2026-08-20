import { readInputLines } from '../utils/input';
import { sum } from '../utils/utils';

function solveDay22Part2(inputLines: number[]): number {
  const MOD = 16777216; // 2^24
  const NUM_SECRETS = 2001; // initial + 2000 new
  const windowSize = 5;

  // Mix-and-prune helper (value is masked to 24 bits)
  const mixPrune = (val: number, mixed: number) => (val ^ mixed) % MOD;

  // Generate the sequence of NUM_SECRETS last-digits for a starting seed
  function generateLastDigits(seedOrig: number): number[] {
    // use 32-bit integers (JS numbers are safe up to 2^53)
    let s = seedOrig >>> 0;
    const out: number[] = new Array(NUM_SECRETS);
    out[0] = s % 10;
    for (let i = 1; i < NUM_SECRETS; i++) {
      // step 1: multiply by 64 -> shift left 6
      s = mixPrune(s, (s << 6) >>> 0);
      // step 2: divide by 32 -> shift right 5
      s = mixPrune(s, s >>> 5);
      // step 3: multiply by 2048 -> shift left 11
      s = mixPrune(s, (s << 11) >>> 0);
      // prune implicitly done by modulo
      out[i] = s % 10;
    }
    return out;
  }

  // Pack 4 deltas (each in -9..9) into a single integer key via base-19
  function packDeltas(d0: number, d1: number, d2: number, d3: number): number {
    // map -9..9 -> 0..18
    const a = d0 + 9,
      b = d1 + 9,
      c = d2 + 9,
      d = d3 + 9;
    return (((a * 19 + b) * 19 + c) * 19 + d) >>> 0;
  }

  const totals = new Map<number, number>(); // packedKey -> accumulated score

  for (const line of inputLines) {
    const digits = generateLastDigits(line); // length 2001
    const seen = new Set<number>(); // patterns seen for this buyer

    // iterate windows of size 5 -> produce 4 deltas and last digit as score
    for (let i = 0, end = NUM_SECRETS - (windowSize - 1); i < end; i++) {
      const a = digits[i],
        b = digits[i + 1],
        c = digits[i + 2],
        d = digits[i + 3],
        e = digits[i + 4];
      const k = packDeltas(b - a, c - b, d - c, e - d);
      if (!seen.has(k)) {
        seen.add(k);
        totals.set(k, (totals.get(k) ?? 0) + e);
      }
    }
  }

  // find maximum total
  let best = -Infinity;
  for (const v of totals.values()) {
    if (v > best) best = v;
  }
  return best;
}

/** To mix a value into the secret number, calculate the bitwise XOR of the given value and the secret number. Then, the secret number becomes the result of that operation. (If the secret number is 42 and you were to mix 15 into the secret number, the secret number would become 37.)*/
const mix = (secret: number, value: number) => {
  return Number(BigInt(value) ^ BigInt(secret));
};

/** To prune the secret number, calculate the value of the secret number modulo 16777216. Then, the secret number becomes the result of that operation. (If the secret number is 100000000 and you were to prune the secret number, the secret number would become 16113920.) */
const prune = (secret: number) => {
  return secret % 16777216;
};

const calcSecret = (n: number): number => {
  const n1 = mix(n, n * 64);
  const n2 = prune(n1);
  const n3 = mix(n2, Math.floor(n2 / 32));
  const n4 = prune(n3);
  const n5 = mix(n4, n4 * 2048);

  return prune(n5);
};

const partOne = (n: number): number => {
  for (let i = 0; i < 2000; i++) {
    n = calcSecret(n);
  }
  return n;
};

const calcPrices = (n: number, deltas: Map<string, number>): number => {
  let secret = n;
  let value = secret % 10;
  const prices: number[] = [secret % 10];
  const diffs: number[] = [secret % 10];
  const seen = new Set<string>();

  for (let i = 0; i < 2000; i++) {
    secret = calcSecret(secret);
    const modus = secret % 10;
    diffs.push(modus - value);
    value = modus;
    prices.push(value);

    if (i >= 3) {
      const key = diffs.slice(i - 4, i).join('_');

      if (!seen.has(key)) {
        seen.add(key);
        deltas.set(key, (deltas.get(key) ?? 0) + prices[i]);
      }
    }
  }
  return value;
};

const partTwo = (lines: number[]): number => {
  const deltas = new Map<string, number>();

  lines.map(s => calcPrices(s, deltas));

  let best = -Infinity;
  for (const [key, v] of deltas.entries()) {
    if (v > best) {
      console.log(key, v, best);
      best = v;
    }
  }
  return best;
};

export function day22(day: number, test: boolean) {
  const lines = readInputLines(day, test).map(n => Number(n));

  // Part 1
  console.time();
  const part1 = lines.map(l => partOne(l));
  // console.log(part1);
  console.timeEnd();

  // Part 2
  console.time();
  const res2 = partTwo(lines);
  console.log(res2);
  console.timeEnd();

  // Part 2 GPT: 2152
  console.time();
  const res = solveDay22Part2(lines);
  console.log(res);
  console.timeEnd();

  return {
    part1: sum(part1),
    part2: res2,
  };
}
