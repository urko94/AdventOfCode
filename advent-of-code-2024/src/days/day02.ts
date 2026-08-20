import { readMap } from '../utils/input';
import { sum } from '../utils/utils';

const checkLevels = (levels: number[]) => {
  if (levels.length <= 2) return 0;

  const isDescending = levels[0] > levels[1];
  for (let i = 0; i < levels.length - 1; i++) {
    if (Math.abs(levels[i] - levels[i + 1]) > 3) return 0;
    if (Math.abs(levels[i] - levels[i + 1]) === 0) return 0;
    if (isDescending && levels[i] < levels[i + 1]) return 0;
    if (!isDescending && levels[i] > levels[i + 1]) return 0;
  }

  return 1;
};

export function day02() {
  const reports = readMap(2);

  // Part 1
  const res1 = reports.map(levels => checkLevels(levels));

  //Part 2
  const res2 = reports.map(levels => {
    const valid = checkLevels(levels);
    if (!valid) {
      for (let i = 0; i < levels.length; i++) {
        const valid = checkLevels(levels.filter((_, index) => index !== i));
        if (valid) return valid;
      }
    }
    return valid;
  });

  return {
    part1: sum(res1),
    part2: sum(res2),
  };
}
