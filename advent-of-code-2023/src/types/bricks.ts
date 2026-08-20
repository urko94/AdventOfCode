// ---- Types ----

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Range3D {
  start: Vec3;
  end: Vec3;
}
export interface SupportGraph {
  supports: Map<number, number[]>;
  supportedBy: Map<number, number[]>;
}

// Each brick represents a rectangular prism defined by two opposite corners
export class Brick {
  id: number;
  start: Vec3;
  end: Vec3;

  constructor(id: number, start: Vec3, end: Vec3) {
    this.id = id;
    // Normalize order (ensure start <= end in all axes)
    this.start = {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      z: Math.min(start.z, end.z),
    };
    this.end = {
      x: Math.max(start.x, end.x),
      y: Math.max(start.y, end.y),
      z: Math.max(start.z, end.z),
    };
  }

  /** Returns all coordinates occupied by this brick */
  public cubes(): Vec3[] {
    const cubes: Vec3[] = [];
    for (let x = this.start.x; x <= this.end.x; x++) {
      for (let y = this.start.y; y <= this.end.y; y++) {
        for (let z = this.start.z; z <= this.end.z; z++) {
          cubes.push({ x, y, z });
        }
      }
    }
    return cubes;
  }

  /** Move the brick down by one unit */
  public fall(): void {
    this.start.z--;
    this.end.z--;
  }

  /** Returns true if this brick overlaps another brick */
  public intersects(other: Brick): boolean {
    return !(
      this.end.x < other.start.x ||
      this.start.x > other.end.x ||
      this.end.y < other.start.y ||
      this.start.y > other.end.y ||
      this.end.z < other.start.z ||
      this.start.z > other.end.z
    );
  }

  /** True if this brick is directly above another (touches by z-1) */
  public isDirectlyAbove(other: Brick): boolean {
    return (
      this.start.z === other.end.z + 1 &&
      this.end.x >= other.start.x &&
      this.start.x <= other.end.x &&
      this.end.y >= other.start.y &&
      this.start.y <= other.end.y
    );
  }
}

// ---- Parser ----

export const parseBricks = (input: string): Brick[] => {
  const lines = input.trim().split('\n');
  return lines.map((line, i) => {
    const [a, b] = line.split('~');
    const [x1, y1, z1] = a.split(',').map(Number);
    const [x2, y2, z2] = b.split(',').map(Number);
    return new Brick(i, { x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 });
  });
};

// ---- Helper ----

/** Sort bricks by their lowest z-coordinate (bottom-up) */
export const sortByHeight = (bricks: Brick[]): Brick[] => bricks.sort((a, b) => a.start.z - b.start.z);

/** Check if two bricks occupy overlapping space */
export const overlaps = (a: Brick, b: Brick): boolean => a.intersects(b);
