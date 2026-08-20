import { readInput } from '../utils/input';
import { parseBricks, sortByHeight, Brick, SupportGraph } from '../types/bricks';

const settleBricks = (bricks: Brick[]): void => {
  const sorted = sortByHeight(bricks);

  for (const brick of sorted) {
    // Lower it until it hits z=1 or another brick
    while (brick.start.z > 1) {
      brick.fall();
      // Check collision
      const collision = sorted.some(b => b !== brick && brick.intersects(b));
      if (collision) {
        // Undo last fall
        brick.start.z++;
        brick.end.z++;
        break;
      }
    }
  }
};
const buildSupportGraph = (bricks: Brick[]): SupportGraph => {
  const supports = new Map<number, number[]>();
  const supportedBy = new Map<number, number[]>();

  for (const a of bricks) {
    for (const b of bricks) {
      if (a !== b && b.isDirectlyAbove(a)) {
        if (!supports.has(a.id)) supports.set(a.id, []);
        if (!supportedBy.has(b.id)) supportedBy.set(b.id, []);
        supports.get(a.id)!.push(b.id);
        supportedBy.get(b.id)!.push(a.id);
      }
    }
  }

  return { supports, supportedBy };
};

const partOne = (bricks: Brick[]): number => {
  settleBricks(bricks);
  const { supports, supportedBy } = buildSupportGraph(bricks);

  let safeCount = 0;

  for (const brick of bricks) {
    const supported = supports.get(brick.id) ?? [];

    const allSupportedHaveOtherSupport = supported.every(bId => {
      const below = supportedBy.get(bId) ?? [];
      return below.length > 1;
    });

    if (allSupportedHaveOtherSupport) safeCount++;
  }

  return safeCount;
};

/**
 * Count how many bricks would fall if one brick were removed.
 */
export const countFalls = (
  removedId: number,
  supports: Map<number, number[]>,
  supportedBy: Map<number, number[]>
): number => {
  const falling = new Set<number>([removedId]); // start with the removed one
  const queue = [removedId];

  while (queue.length > 0) {
    const current = queue.shift()!;

    // All bricks that this one supports
    const above = supports.get(current) ?? [];
    for (const bId of above) {
      if (falling.has(bId)) continue; // already falling

      // Check if *all* bricks supporting bId are falling
      const below = supportedBy.get(bId) ?? [];
      const allSupportsGone = below.every(id => falling.has(id));

      if (allSupportsGone) {
        falling.add(bId);
        queue.push(bId);
      }
    }
  }

  // Do not count the initially removed one
  return falling.size - 1;
};

/**
 * Part Two: For every brick, remove it and see how many others fall.
 * Then sum those totals.
 */
export const partTwo = (bricks: Brick[]): number => {
  settleBricks(bricks);
  const { supports, supportedBy } = buildSupportGraph(bricks);

  let totalFalling = 0;

  for (const brick of bricks) {
    const fallenCount = countFalls(brick.id, supports, supportedBy);
    totalFalling += fallenCount;
  }

  return totalFalling;
};

export function day22(day: number, test: boolean) {
  const input = readInput(day, test);
  const bricks = parseBricks(input);

  // Part 1
  const res1 = partOne(bricks);

  // Part 2
  const res2 = partTwo(bricks);

  return {
    part1: res1,
    part2: res2,
  };
}
