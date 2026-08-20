import { parentPort } from 'worker_threads';
import { isPartInvalid, isValid, Record, Spring } from '../days/day12';
import { replaceAt } from '../utils/utils';

const resolveRec = (springs: string, arrangement: number[], depth = 0): number => {
  if (!springs.includes(Spring.UNKNOWN)) {
    return isValid(springs, arrangement) ? 1 : 0;
  } else if (depth > 3 && isPartInvalid(springs, arrangement)) {
    return 0;
  } else {
    const idx = springs.indexOf(Spring.UNKNOWN);
    return (
      resolveRec(replaceAt(springs, idx, Spring.DAMAGED), arrangement, depth + 1) +
      resolveRec(replaceAt(springs, idx, Spring.OPERATIONAL), arrangement, depth + 1)
    );
  }
};
const partTwo = (r: Record): number => {
  return resolveRec(r.springs, r.arrangement);
};

parentPort?.on('message', (r: Record) => {
  parentPort?.postMessage(partTwo(r));
});
