// ---- Enums ----
export enum Axis {
  X = 'x',
  Y = 'y',
  Z = 'z',
}

// ---- Types ----
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Hailstone {
  position: Vec3;
  velocity: Vec3;
}

// ---- Constants ----
export const TEST_AREA = {
  MIN: 7,
  MAX: 27,
};
export const AREA = {
  MIN: 200000000000000,
  MAX: 400000000000000,
};

// ---- Parsing ----
/**
 * Parse a single line like:
 *   "19, 13, 30 @ -2, 1, -2"
 */
export function parseHailstone(line: string): Hailstone {
  const [posStr, velStr] = line.split('@').map(s => s.trim());
  const [x, y, z] = posStr.split(',').map(Number);
  const [vx, vy, vz] = velStr.split(',').map(Number);

  return {
    position: { x, y, z },
    velocity: { x: vx, y: vy, z: vz },
  };
}

/**
 * Compute 2D intersection of two hailstones (x, y only).
 * Returns `null` if parallel or intersection in the past.
 */
export function intersect2D(a: Hailstone, b: Hailstone): { x: number; y: number; ta: number; tb: number } | null {
  const { position: pa, velocity: va } = a;
  const { position: pb, velocity: vb } = b;

  const det = va.x * vb.y - va.y * vb.x;
  if (det === 0) return null; // parallel lines

  const dx = pb.x - pa.x;
  const dy = pb.y - pa.y;

  const ta = (dx * vb.y - dy * vb.x) / det;
  const tb = (dx * va.y - dy * va.x) / det;

  if (ta < 0 || tb < 0) return null; // only future intersections

  const x = pa.x + va.x * ta;
  const y = pa.y + va.y * ta;

  return { x, y, ta, tb };
}

/**
 * Check if point is inside the test area.
 */
export function inTestArea(x: number, y: number, area: { MIN: number; MAX: number }): boolean {
  return x >= area.MIN && x <= area.MAX && y >= area.MIN && y <= area.MAX;
}

// Part 2
export interface Rock {
  position: Vec3;
  velocity: Vec3;
}

/**
 * Solve a system of linear equations using Gaussian elimination.
 * Matrix is `n x (n+1)` (augmented matrix).
 */
export function solveLinearSystem(matrix: number[][]): number[] {
  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    // Find pivot row
    let pivot = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(Number(matrix[j][i])) > Math.abs(Number(matrix[pivot][i]))) {
        pivot = j;
      }
    }
    [matrix[i], matrix[pivot]] = [matrix[pivot], matrix[i]];

    // Normalize pivot row
    const div = matrix[i][i];
    if (Math.abs(Number(div)) < 1e-12) continue;
    for (let j = i; j <= n; j++) matrix[i][j] /= div;

    // Eliminate column
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = matrix[k][i];
      for (let j = i; j <= n; j++) {
        matrix[k][j] -= factor * matrix[i][j];
      }
    }
  }

  return matrix.map(row => row[n]);
}

export function solveRock(hailstones: Hailstone[]): Rock {
  const [a, b, c] = hailstones;

  // Using pairs (a,b) and (a,c)
  const M: number[][] = [];

  const addEquations = (h1: Hailstone, h2: Hailstone) => {
    const { position: p1, velocity: v1 } = h1;
    const { position: p2, velocity: v2 } = h2;

    // (x - px) / vx = (x - px2) / vx2
    // Expand into linear form
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;

    const dvx = v2.x - v1.x;
    const dvy = v2.y - v1.y;
    const dvz = v2.z - v1.z;

    // Equation for X-Y
    M.push([dvy, -dvx, 0, dy, -dx, 0, p1.x * v1.y - p1.y * v1.x - p2.x * v2.y + p2.y * v2.x]);

    // Equation for X-Z
    M.push([dvz, 0, -dvx, dz, 0, -dx, p1.x * v1.z - p1.z * v1.x - p2.x * v2.z + p2.z * v2.x]);
  };

  addEquations(a, b);
  addEquations(a, c);

  // Solve 6x7 linear system
  const solution = solveLinearSystem(M);
  const [vx, vy, vz, x, y, z] = solution;

  return { position: { x, y, z }, velocity: { x: vx, y: vy, z: vz } };
}
