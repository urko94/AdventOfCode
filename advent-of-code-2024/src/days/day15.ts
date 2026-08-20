import { readInput } from '../utils/input';
import { printGrid } from '../utils/output';
import { findPosition, sum } from '../utils/utils';

const hasEmptyBracket = (map: string[][]): boolean => {
  for (let i = 1; i < map.length - 1; i++) {
    for (let j = 2; j < map[i].length - 3; j++) {
      if (map[i][j] === '[' && map[i][j + 1] !== ']') {
        return true;
      }
    }
  }
  return false;
};

type Direction = { dy: number; dx: number };

const directions: Record<string, Direction> = {
  UP: { dy: -1, dx: 0 },
  DOWN: { dy: 1, dx: 0 },
  LEFT: { dy: 0, dx: -1 },
  RIGHT: { dy: 0, dx: 1 },
};

function move(map: string[][], y: number, x: number, dir: Direction): [number, number] {
  const ny = y + dir.dy;
  const nx = x + dir.dx;
  if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length || map[ny][nx] === '#') {
    return [y, x];
  }
  if (map[ny][nx] === '.') {
    map[y][x] = '.';
    map[ny][nx] = '@';
    return [ny, nx];
  }
  if (map[ny][nx] === 'O') {
    let i = 1;
    while (true) {
      const oy = ny + dir.dy * i;
      const ox = nx + dir.dx * i;
      if (oy < 0 || oy >= map.length || ox < 0 || ox >= map[0].length || map[oy][ox] === '#') {
        break;
      }
      if (map[oy][ox] === '.') {
        map[y][x] = '.';
        map[oy][ox] = 'O';
        map[ny][nx] = '@';
        return [ny, nx];
      }
      i++;
    }
  }
  return [y, x];
}

/**
 * MAP
########
#.[][].#
##@.[].#
#...[].#
#.#.[].#
#...[].#
#......#
########
# is fence -> can't move there
. is free space -> move there
O is an obstacle -> push obstacle if any free space behind it (till the end of line)
[] is double obstacle -> push obstacle if any free space behind it (till the end of line)
 */
const moveLeft = (map: string[][], y: number, x: number): [number, number] => {
  if (x < 0) return [y, x];
  if (map[y][x - 1] === '.') {
    map[y][x] = '.';
    map[y][x - 1] = '@';
    return [y, x - 1];
  }
  if (map[y][x - 1] === ']') {
    for (let i = x - 3; i >= 0; i--) {
      if (map[y][i] === '#') {
        break;
      }
      if (map[y][i] === '.') {
        for (let j = i; j < x; j++) {
          map[y][j] = map[y][j + 1];
        }
        map[y][x] = '.';
        return [y, x - 1];
      }
    }
  }
  return [y, x];
};
const moveRight = (map: string[][], y: number, x: number): [number, number] => {
  if (x >= map[y].length - 1) return [y, x];
  if (map[y][x + 1] === '.') {
    map[y][x] = '.';
    map[y][x + 1] = '@';
    return [y, x + 1];
  }
  if (map[y][x + 1] === '[') {
    for (let i = x + 3; i < map[y].length; i++) {
      if (map[y][i] === '#') {
        break;
      }
      if (map[y][i] === '.') {
        for (let j = i; j > x; j--) {
          map[y][j] = map[y][j - 1];
        }
        map[y][x] = '.';
        return [y, x + 1];
      }
    }
  }
  return [y, x];
};
const moveUp = (map: string[][], y: number, x: number): [number, number] => {
  if (y < 0) return [y, x];
  if (map[y - 1][x] === '.') {
    map[y][x] = '.';
    map[y - 1][x] = '@';
    return [y - 1, x];
  }
  if (map[y - 1][x] === '[' || map[y - 1][x] === ']') {
    let l = map[y - 1][x] === ']' ? x - 1 : x;
    let r = map[y - 1][x] === '[' ? x + 1 : x;
    const fieldsToMove: number[][] = [[l, r]];

    for (let i = y - 2; i >= 0; i--) {
      let allFree = true;
      for (let lr = l; lr <= r; lr++) {
        if (map[i][lr] === '#') {
          return [y, x];
        }
        if (map[i][lr] !== '.') {
          allFree = false;
        }
      }
      if (allFree) {
        let fieldIndex = fieldsToMove.length - 1;
        for (let di = i; di < y - 1; di++) {
          for (let lr = fieldsToMove[fieldIndex][0]; lr <= fieldsToMove[fieldIndex][1]; lr++) {
            map[di][lr] = map[di + 1][lr];
            map[di + 1][lr] = '.';
          }
          fieldIndex--;
        }
        map[y][x] = '.';
        map[y - 1][x] = '@';
        return [y - 1, x];
      } else {
        if (map[i][l] === ']') l -= 1;
        else if (map[i][l] === '.') {
          while (map[i][l] === '.') l++;
        }
        if (map[i][r] === '[') r += 1;
        else if (map[i][r] === '.') {
          while (map[i][r] === '.') r--;
        }
        fieldsToMove.push([l, r]);
      }
    }
  }
  return [y, x];
};
const moveDown = (map: string[][], y: number, x: number): [number, number] => {
  if (y >= map.length - 1) return [y, x];
  if (map[y + 1][x] === '.') {
    map[y][x] = '.';
    map[y + 1][x] = '@';
    return [y + 1, x];
  }
  if (map[y + 1][x] === 'O') {
    for (let i = y + 2; i < map.length; i++) {
      if (map[i][x] === '#') {
        break;
      }
      if (map[i][x] === '.') {
        map[y][x] = '.';
        map[i][x] = 'O';
        map[y + 1][x] = '@';
        return [y + 1, x];
      }
    }
  }
  if (map[y + 1][x] === '[' || map[y + 1][x] === ']') {
    let l = map[y + 1][x] === ']' ? x - 1 : x;
    let r = map[y + 1][x] === '[' ? x + 1 : x;
    const fieldsToMove: number[][] = [[l, r]];

    for (let i = y + 2; i < map.length; i++) {
      let allFree = true;
      for (let lr = l; lr <= r; lr++) {
        if (map[i][lr] === '#') {
          return [y, x];
        }
        if (map[i][lr] !== '.') {
          allFree = false;
        }
      }
      if (allFree) {
        let fieldIndex = fieldsToMove.length - 1;
        for (let di = i; di > y + 1; di--) {
          for (let lr = fieldsToMove[fieldIndex][0]; lr <= fieldsToMove[fieldIndex][1]; lr++) {
            map[di][lr] = map[di - 1][lr];
            map[di - 1][lr] = '.';
          }
          fieldIndex--;
        }
        map[y][x] = '.';
        map[y + 1][x] = '@';
        return [y + 1, x];
      } else {
        if (map[i][l] === ']') l -= 1;
        else if (map[i][l] === '.') {
          while (map[i][l] === '.') l++;
        }
        if (map[i][r] === '[') r += 1;
        else if (map[i][r] === '.') {
          while (map[i][r] === '.') r--;
        }
        fieldsToMove.push([l, r]);
      }
    }
  }
  return [y, x];
};

const partOne = (map: string[][], commands: string[]): number => {
  let [y, x] = findPosition(map, '@');
  commands.forEach(command => {
    switch (command) {
      case '^':
        [y, x] = move(map, y, x, directions.UP);
        break;
      case 'v':
        [y, x] = move(map, y, x, directions.DOWN);
        break;
      case '<':
        [y, x] = move(map, y, x, directions.LEFT);
        break;
      case '>':
        [y, x] = move(map, y, x, directions.RIGHT);
        break;
    }
  });
  return 0;
};
const partTwo = (map: string[][], commands: string[]): number => {
  let [y, x] = findPosition(map, '@');
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    switch (command) {
      case '^':
        [y, x] = moveUp(map, y, x);
        break;
      case 'v':
        [y, x] = moveDown(map, y, x);
        break;
      case '<':
        [y, x] = moveLeft(map, y, x);
        break;
      case '>':
        [y, x] = moveRight(map, y, x);
        break;
    }
  }
  return 0;
};

export function day15(day: number, test: boolean) {
  const [inputMap, inputCommands] = readInput(day, test).split('\n\n');
  const map = inputMap.split('\n').map(line => line.split(''));
  const commands = inputCommands.replace('\n', '').trim().split('');

  // Part 1
  partOne(map, commands);
  // printGrid(map);

  const res1 = map.map((row, y) =>
    row.reduce((acc, curr, x) => {
      if (curr === 'O') {
        acc += 100 * y + x;
      }
      return acc;
    }, 0)
  );

  //Part 2
  const map2 = inputMap.split('\n').map(line =>
    line.split('').reduce((acc: string[], curr) => {
      if (curr === '@') {
        acc.push('@');
        acc.push('.');
      } else if (curr === 'O') {
        acc.push('[');
        acc.push(']');
      } else {
        acc.push(curr);
        acc.push(curr);
      }
      return acc;
    }, [])
  );
  partTwo(map2, commands);
  printGrid(map2);
  const res2 = map2.map((row, y) =>
    row.reduce((acc, curr, x) => {
      if (curr === '[') {
        acc += 100 * y + x;
      }
      return acc;
    }, 0)
  );

  return {
    part1: sum(res1),
    part2: sum(res2),
  };
}
