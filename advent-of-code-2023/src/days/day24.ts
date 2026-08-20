import { AREA, Hailstone, intersect2D, inTestArea, parseHailstone, solveRock, TEST_AREA } from '../utils/hailstone';
import { HailstoneBigInt, parseInputBigInt, solveRockBigInt } from '../utils/hailstoneBigInt';
import { readInput } from '../utils/input';

function partOne(hailstones: Hailstone[], test: boolean): number {
  let counter = 0;
  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const result = intersect2D(hailstones[i], hailstones[j]);
      // console.log(`Hailstones ${i} and ${j} intersect at:`, result);
      if (result && inTestArea(result.x, result.y, test ? TEST_AREA : AREA)) {
        counter++;
      }
    }
  }
  return counter;
}

function partTwo(hailstones: Hailstone[]): number {
  const rock = solveRock(hailstones);
  console.log('Rock position at intersection:', rock.position);
  return Math.round((rock.position.x || 0) + (rock.position.y || 0) + (rock.position.z || 0));
}
function partTwoBigInt(hailstones: HailstoneBigInt[]): bigint {
  const rock = solveRockBigInt(hailstones);
  console.log('Rock position at intersection:', rock.position);
  return (rock.position.x || 0n) + (rock.position.y || 0n) + (rock.position.z || 0n);
}

export function day24(day: number, test: boolean) {
  const hailstones: Hailstone[] = readInput(day, test).trim().split(/\r?\n/).filter(Boolean).map(parseHailstone);
  const hailstones2: HailstoneBigInt[] = readInput(day, test)
    .trim()
    .split('\n')
    .map(line => parseInputBigInt(line));

  // Part 1
  const res1 = partOne(hailstones, test);

  // Part 2
  console.log(hailstones2);
  const res2 = partTwoBigInt(hailstones2);

  return {
    part1: res1,
    part2: res2,
  };
}
