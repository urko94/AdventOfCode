import { parseNumbers, readInput } from '../utils/input';

type Interval = [number, number];
type Rule = { dest: number; src: number; len: number };

const parseSeeds = (input: string): number[] => {
  const [_, seeds] = input.split('seeds: ');
  return parseNumbers(seeds);
};
const parseMapping = (input: string): Rule => {
  const [dest, src, len] = parseNumbers(input);
  return { dest, src, len };
};
const createMapping = (mappings: Rule[]): Record<number, number> => {
  const result = {} as Record<number, number>;
  for (const mapping of mappings) {
    for (let i = 0; i < mapping.len; i++) {
      result[mapping.src + i] = mapping.dest + i;
    }
  }
  return result;
};

const mapValue = (value: number, mappings: Rule[]): number => {
  for (const mapping of mappings) {
    if (mapping.src <= value && value < mapping.src + mapping.len) {
      return mapping.dest + (value - mapping.src);
    }
  }
  return value;
};

function mapIntervals(intervals: Interval[], rules: Rule[]): Interval[] {
  const result: Interval[] = [];

  for (const [start, end] of intervals) {
    let toProcess: Interval[] = [[start, end]];

    for (const { dest, src, len } of rules) {
      const srcStart = src;
      const srcEnd = src + len - 1;
      const offset = dest - src;

      const newToProcess: Interval[] = [];

      for (const [s, e] of toProcess) {
        if (e < srcStart || s > srcEnd) {
          // no overlap
          newToProcess.push([s, e]);
        } else {
          // left remainder
          if (s < srcStart) newToProcess.push([s, srcStart - 1]);

          // overlap part → mapped
          const overlapStart = Math.max(s, srcStart);
          const overlapEnd = Math.min(e, srcEnd);
          result.push([overlapStart + offset, overlapEnd + offset]);

          // right remainder
          if (e > srcEnd) newToProcess.push([srcEnd + 1, e]);
        }
      }

      toProcess = newToProcess;
    }

    result.push(...toProcess);
  }

  return result;
}

export function day05(day: number, test: boolean) {
  const inputs = readInput(day, test).split('\n\n');
  const seeds = parseSeeds(inputs[0]);
  const mappingsData = inputs.slice(1, inputs.length).map(line =>
    line
      .split(':\n')[1]
      .split('\n')
      .map(m => parseMapping(m))
  );

  // Part 1
  const res1 = seeds.map((s, i) => {
    let current = s;
    for (const mapping of mappingsData) {
      current = mapValue(current, mapping);
    }
    return current;
  });

  // Part 2
  const seedIntervals: Interval[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i];
    const len = seeds[i + 1];
    seedIntervals.push([start, start + len - 1]);
  }
  let intervals = seedIntervals;
  for (const rules of mappingsData) {
    intervals = mapIntervals(intervals, rules);
  }

  return {
    part1: Math.min(...res1),
    part2: Math.min(...intervals.map(([s, _]) => s)),
  };
}
