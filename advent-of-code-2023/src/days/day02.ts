import { readInputLines } from '../utils/input';
import { sum } from '../utils/utils';

enum Cube {
  BLUE = 'blue',
  RED = 'red',
  GREEN = 'green',
}

const limits = {
  [Cube.RED]: 12,
  [Cube.GREEN]: 13,
  [Cube.BLUE]: 14,
};

const readGameId = (s: string) => {
  const match = s.match(/-?\d+/g);
  return match ? parseInt(match[0], 10) : 0;
};

const readCubes = (s: string) => {
  return s
    .trim()
    .split(',')
    .reduce(
      (acc, curr) => {
        const [numStr, color] = curr.trim().split(' ');
        const num = parseInt(numStr, 10);
        acc[color as Cube] = (acc[color as Cube] || 0) + num;
        return acc;
      },
      {} as Record<Cube, number>
    );
};

const gamePossible = (cubes: Record<Cube, number>) => {
  return Object.entries(cubes).every(([color, count]) => count <= (limits as any)[color]);
};

export function day02(day: number, test: boolean) {
  const lines = readInputLines(day, test);

  // Part 1
  const res1 = lines.map(line => {
    const [id, games] = line.split(':');
    const gameId = readGameId(id);

    const results = games.split(';').map(g => {
      const cubes = readCubes(g);
      return gamePossible(cubes) ? 1 : 0;
    });

    return results.every(r => r === 1) ? gameId : 0;
  });

  //Part 2
  const res2 = lines.map(line => {
    const [_, games] = line.split(':');

    const requiredCubes = {
      [Cube.RED]: 0,
      [Cube.GREEN]: 0,
      [Cube.BLUE]: 0,
    };
    games.split(';').forEach(g => {
      const cubes = readCubes(g);
      if (cubes[Cube.RED] && cubes[Cube.RED] > requiredCubes[Cube.RED]) {
        requiredCubes[Cube.RED] = cubes[Cube.RED];
      }
      if (cubes[Cube.GREEN] && cubes[Cube.GREEN] > requiredCubes[Cube.GREEN]) {
        requiredCubes[Cube.GREEN] = cubes[Cube.GREEN];
      }
      if (cubes[Cube.BLUE] && cubes[Cube.BLUE] > requiredCubes[Cube.BLUE]) {
        requiredCubes[Cube.BLUE] = cubes[Cube.BLUE];
      }
    });

    return (requiredCubes[Cube.RED] || 1) * (requiredCubes[Cube.GREEN] || 1) * (requiredCubes[Cube.BLUE] || 1);
  });

  return {
    part1: sum(res1),
    part2: sum(res2),
  };
}
