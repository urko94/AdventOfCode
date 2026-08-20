import { readInputLines } from '../utils/input';

enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}
const cursor = {
  [Direction.UP]: '^',
  [Direction.RIGHT]: '>',
  [Direction.DOWN]: 'ˇ',
  [Direction.LEFT]: '<',
};

type Position = [number, number];

const getDirection = (c: string) => {
  switch (c) {
    case cursor[Direction.UP]:
      return Direction.UP;
    case cursor[Direction.RIGHT]:
      return Direction.RIGHT;
    case cursor[Direction.DOWN]:
      return Direction.DOWN;
    case cursor[Direction.LEFT]:
      return Direction.LEFT;
    default:
      return 0;
  }
};

const findPosition = (grid: string[][]) => {
  for (let rowI = 0; rowI < grid.length; rowI++) {
    const colI = grid[rowI].findIndex(c => Object.values(cursor).includes(c));
    if (colI >= 0) {
      return [rowI, colI, getDirection(grid[rowI][colI])];
    }
  }
  return [0, 0, 0];
};

const getNextPosition = (x: number, y: number, direction: number): Position => {
  switch (direction) {
    case Direction.UP:
      return [x - 1, y];
    case Direction.RIGHT:
      return [x, y + 1];
    case Direction.DOWN:
      return [x + 1, y];
    case Direction.LEFT:
      return [x, y - 1];
    default:
      return [x, y];
  }
};

const isRectangle = (turns: Position[], x: number, y: number): boolean => {
  if (turns.length < 3) return false;

  for (let i = 0; i < turns.length - 2; i++) {
    for (let j = i + 1; j < turns.length - 1; j++) {
      for (let k = j + 1; k < turns.length; k++) {
        const [x1, y1] = turns[i];
        const [x2, y2] = turns[j];
        const [x3, y3] = turns[k];

        if ((x === x3 && y === y1 && x1 === x2 && y2 === y3) || (x === x1 && y === y3 && x2 === x3 && y1 === y2)) {
          return true;
        }
      }
    }
  }
  return false;
};

const findPath = (grid: string[][], x: number, y: number, direction: Direction): Array<any> => {
  const squares: Position[] = [];

  const getDirectionChecks = (x: number, y: number, direction: Direction) => {
    switch (direction) {
      case Direction.LEFT:
        return {
          start: x - 1,
          end: 0,
          step: -1,
          cursorCheck: cursor[Direction.UP],
          gridCheck: (i: number) => grid[i][y],
        };
      case Direction.RIGHT:
        return {
          start: x + 1,
          end: grid.length,
          step: 1,
          cursorCheck: cursor[Direction.DOWN],
          gridCheck: (i: number) => grid[i][y],
        };
      case Direction.UP:
        return {
          start: y + 1,
          end: grid[0].length,
          step: 1,
          cursorCheck: cursor[Direction.RIGHT],
          gridCheck: (i: number) => grid[x][i],
        };
      case Direction.DOWN:
        return {
          start: y - 1,
          end: -1,
          step: -1,
          cursorCheck: cursor[Direction.LEFT],
          gridCheck: (i: number) => grid[x][i],
        };
      default:
        throw new Error('Invalid direction');
    }
  };

  while (true) {
    grid[x][y] = grid[x][y] === '.' ? cursor[direction] : grid[x][y] + cursor[direction];
    if (
      (x <= 0 && direction === Direction.UP) ||
      (x >= grid.length - 1 && direction === Direction.DOWN) ||
      (y <= 0 && direction === Direction.LEFT) ||
      (y >= grid[0].length - 1 && direction === Direction.RIGHT)
    ) {
      return squares;
    }
    let [nextX, nextY] = getNextPosition(x, y, direction);

    let check = getDirectionChecks(x, y, direction);
    for (let i = check.start; check.step > 0 ? i < check.end : i > check.end; i += check.step) {
      const cell = check.gridCheck(i);
      if (cell === '#') break;
      if (cell.includes(check.cursorCheck)) {
        squares.push([nextX, nextY]);
        break;
      }
    }

    if (grid[nextX][nextY] === '#') {
      direction = (direction + 1) % 4; // turn
      [nextX, nextY] = getNextPosition(x, y, direction);
    } else {
      x = nextX;
      y = nextY;
    }
  }
};

export function day06() {
  const lines = readInputLines(6, true);
  const grid = lines.map(l => l.split(''));

  // printGrid(grid);
  const [x, y, direction] = findPosition(grid);

  // Part 1
  const obstacles = findPath(grid, x, y, direction);
  // printGrid(obstacles);

  //Part 2
  // findObstructions(grid, x, y, direction);
  // printLines(grid);

  return {
    part1: grid.flat().reduce((acc: number, curr: string) => acc + (!['.', '#'].includes(curr) ? 1 : 0), 0),
    part2: obstacles.length,
  };
}
