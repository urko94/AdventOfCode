export enum Direction {
  RIGHT = 2,
  DOWN = 1,
  LEFT = 3,
  UP = 4,
}

export const directions: Record<Direction, DirectionDiff> = {
  [Direction.DOWN]: { dy: 1, dx: 0 },
  [Direction.RIGHT]: { dy: 0, dx: 1 },
  [Direction.LEFT]: { dy: 0, dx: -1 },
  [Direction.UP]: { dy: -1, dx: 0 },
};

export type Position = [number, number];
export type DirectionDiff = { dy: number; dx: number };

// Map position y: number, x: number
export type MapPosition = { y: number; x: number };

export type Grid = string[][];
