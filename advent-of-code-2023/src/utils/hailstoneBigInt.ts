export interface Vec3BigInt {
  x: bigint;
  y: bigint;
  z: bigint;
}

export interface HailstoneBigInt {
  position: Vec3BigInt;
  velocity: Vec3BigInt;
}

export interface RockBigInt {
  position: Vec3BigInt;
  velocity: Vec3BigInt;
}

export function parseInputBigInt(input: string): HailstoneBigInt {
  const [p, v] = input.split(' @ ');
  const [x, y, z] = p.split(',').map(s => BigInt(s.trim()));
  const [vx, vy, vz] = v.split(',').map(s => BigInt(s.trim()));
  return {
    position: { x, y, z },
    velocity: { x: vx, y: vy, z: vz },
  };
}

type Fraction = { n: bigint; d: bigint }; // numerator / denominator

function makeFrac(n: bigint, d: bigint = 1n): Fraction {
  if (d < 0n) return { n: -n, d: -d };
  const g = gcd(abs(n), d);
  return { n: n / g, d: d / g };
}

function add(a: Fraction, b: Fraction): Fraction {
  return makeFrac(a.n * b.d + b.n * a.d, a.d * b.d);
}
function sub(a: Fraction, b: Fraction): Fraction {
  return makeFrac(a.n * b.d - b.n * a.d, a.d * b.d);
}
function mul(a: Fraction, b: Fraction): Fraction {
  return makeFrac(a.n * b.n, a.d * b.d);
}
function div(a: Fraction, b: Fraction): Fraction {
  return makeFrac(a.n * b.d, a.d * b.n);
}
function abs(x: bigint): bigint {
  return x < 0n ? -x : x;
}
function gcd(a: bigint, b: bigint): bigint {
  while (b) [a, b] = [b, a % b];
  return a;
}

function solveRational(matrix: Fraction[][]): Fraction[] {
  const n = matrix.length;
  const m = matrix[0].length - 1;

  for (let i = 0; i < n; i++) {
    // find pivot
    let pivot = i;
    while (pivot < n && matrix[pivot][i].n === 0n) pivot++;
    if (pivot === n) continue; // no pivot in this column
    if (pivot !== i) [matrix[i], matrix[pivot]] = [matrix[pivot], matrix[i]];

    const divv = matrix[i][i];
    if (divv.n === 0n) throw new Error(`Singular pivot at row ${i}`);

    for (let j = i; j <= m; j++) matrix[i][j] = div(matrix[i][j], divv);

    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = matrix[k][i];
      for (let j = i; j <= m; j++) {
        matrix[k][j] = sub(matrix[k][j], mul(factor, matrix[i][j]));
      }
    }
  }

  return matrix.map(row => row[m]);
}

export function solveRockBigInt(hailstones: HailstoneBigInt[]): RockBigInt {
  const [a, b, c] = hailstones;

  const M: Fraction[][] = [];

  function pushEq(h1: HailstoneBigInt, h2: HailstoneBigInt, M: Fraction[][]) {
    const { position: p1, velocity: v1 } = h1;
    const { position: p2, velocity: v2 } = h2;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    const dvx = v2.x - v1.x;
    const dvy = v2.y - v1.y;
    const dvz = v2.z - v1.z;

    // from (p_r - p_i) × (v_r - v_i) = 0, expanded
    // keep two independent components
    M.push([
      makeFrac(0n),
      makeFrac(-dvz),
      makeFrac(dvy),
      makeFrac(0n),
      makeFrac(-dz),
      makeFrac(dy),
      makeFrac(p1.y * v1.z - p1.z * v1.y - (p2.y * v2.z - p2.z * v2.y)),
    ]);
    M.push([
      makeFrac(dvz),
      makeFrac(0n),
      makeFrac(-dvx),
      makeFrac(dz),
      makeFrac(0n),
      makeFrac(-dx),
      makeFrac(p1.z * v1.x - p1.x * v1.z - (p2.z * v2.x - p2.x * v2.z)),
    ]);
  }

  pushEq(a, b, M);
  pushEq(a, c, M);
  pushEq(b, c, M);

  const sol = solveRational(M);
  const [vx, vy, vz, x, y, z] = sol.map(fr => fr.n / fr.d);

  return {
    position: { x, y, z },
    velocity: { x: vx, y: vy, z: vz },
  };
}
