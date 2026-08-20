import path from 'path';
import { Worker } from 'worker_threads';
import { readInput } from '../utils/input';
import { gcd, lcm, sum } from '../utils/utils';

export type Machine = { x1: number; y1: number; x2: number; y2: number; xr: number; yr: number };
export type Actions = [number, number];

const partOne = (machine: Machine) => {
  const { x1, y1, x2, y2, xr, yr } = machine;
  const results: Actions[] = [];

  for (let i = 0; i < Math.floor(xr / Math.min(x1, x2)); i++) {
    if (i * x1 > xr || i * y1 > yr) {
      break;
    }
    const minJ = Math.min(Math.ceil((xr - i * x1) / x2), Math.ceil((yr - i * y1) / y2));
    for (let j = minJ; j < Math.floor(yr / Math.min(y1, y2)); j++) {
      const sumX = i * x1 + j * x2;
      const sumY = i * y1 + j * y2;
      if (sumX > xr || sumY > yr) break;
      else if (sumX === xr && sumY === yr) {
        results.push([i, j]);
        break;
      }
    }
  }
  return results;
};

/**
     xr = i * x1 + j * x2
     j = (xr - i*x1) / x2
    
     yr = j * y1 + j * y2 
     j = (yr - i*y1) / y2

     GPT
     i * x1 + j * x2 = xr    
     i * y1 + j * y2 = yr


  console.log('gcd 600', gcd(8400, 5400));
  console.log('lcm 126', lcm(14, 9));
     i * 94 + j * 22 = 8400 // GCD: 600
     i * 34 + j * 67 = 5400 // LCM: 126

     i*94/600 + j*22/600 = 14 // * 9
     i*34/600 + j*67/600 = 9  // * 14
     
     i*94/600*9 + j*22/600*9 = 126
     i*34/600*14 + j*67/600*14 = 126
     
     i*94/600*9 + j*22/600*9 = i*34/600*14 + j*67/600*14
     i*94/600*9 -  i*34/600*14 = j*67/600*14 - j*22/600*9
     i * (94/600*9 - 34/600*14) = j * (67/600*14 - 22/600*9)
     i = (j * (14*67/600 - 9*22/600)) / ((94/600*9 - 34/600*14))
     
     j * (67/600*14 - 22/600*9)) / ((94/600*9 - 34/600*14) * 34/600*14 + j*67/600*14 = 126

     1,41*i + 0.33*j = 0.79*i + 1,56*j
     1,41*i - 0.79*i = 1,56*j - 0.33*j
     i* (1,41-0,79) = j * (1,56 - 0.33)
     i* (1,41-0,79) = j * (1,56 - 0.33)
     0,62 * i = 1,23 * j
     j = (0.62 * i) / 1,23
     j = 0.5*i

     i*1,41 + i*0,165 = 126
     i* (1,41+0.165) = 126
     i* (1,41+0.165) = 126
     i* 1,575 = 126
     i = 126/1.575
     i=80

    det = x1 * y2 - y1 * x2;
    det = 94 * 67 - 34 * 22;
    det = 6298 - 748
    det = 5550
*/
const partTwoLinear = (machine: Machine) => {
  const { x1, y1, x2, y2, xr, yr } = machine;
  const results: Actions[] = [];

  const rGCD = gcd(xr, yr);
  const xrS = xr / rGCD; // 14 = 8400 / 600 => 126 / 14 = 9
  const yrS = yr / rGCD; // 9 = 5400 / 600 => 126 / 9 = 14
  const rLCM = lcm(xr / rGCD, yr / rGCD);

  const j = xr / (x2 + (x1 * ((y2 * xrS) / rGCD - (x2 * yrS) / rGCD)) / ((x1 * yrS) / rGCD - (y1 * xrS) / rGCD));
  const i = (xr - j * x2) / x1;

  if (Number.isInteger(i) && Number.isInteger(j) && i >= 0 && j >= 0) {
    results.push([i, j]);
  }
  return results;
};
const partTwo = (machine: Machine) => {
  const { x1, y1, x2, y2, xr, yr } = machine;
  const results: Actions[] = [];
  for (let i = 0; i < Math.ceil(Math.min(xr / x1, yr / y1)); i++) {
    const j1 = (xr - i * x1) / x2;
    const j2 = (yr - i * y1) / y2;

    if (j1 === j2) {
      results.push([i, j1]);
    }
  }
  return results;
};

const bestResult = (results: Actions[]) => {
  if (results.length === 0) return 0;

  return Math.min(...results.map(r => 3 * r[0] + r[1])) || 0;
};

export async function runPartTwo(machines: Machine[]): Promise<number[]> {
  return Promise.all(
    machines.map(
      m =>
        new Promise<number>((resolve, reject) => {
          const worker = new Worker(path.resolve(__dirname, '../worker/day13.ts'), {
            execArgv: ['-r', 'ts-node/register'],
          });
          worker.postMessage(m);
          worker.on('message', (res: Actions[]) => {
            console.log(res);
            resolve(bestResult(res));
            worker.terminate();
          });
          worker.on('error', reject);
        })
    )
  );
}
const partTwoGpt = (machine: Machine): Actions[] => {
  const { x1, y1, x2, y2, xr, yr } = machine;
  const det = x1 * y2 - y1 * x2;
  const results: Actions[] = [];

  if (det !== 0) {
    // unique solution case
    const i = (xr * y2 - yr * x2) / det;
    const j = (x1 * yr - y1 * xr) / det;

    if (Number.isInteger(i) && Number.isInteger(j) && i >= 0 && j >= 0) {
      results.push([i, j]);
    }
  } else {
    // dependent case: (x1,y1) and (x2,y2) are multiples
    // Check if (xr,yr) is also on that line
    if (x1 * yr === y1 * xr) {
      // search for valid (i, j) combos
      // instead of brute force to Infinity, bound search
      const maxI = Math.floor(xr / x1) || 1000;
      for (let i = 0; i <= maxI; i++) {
        const remX = xr - i * x1;
        const remY = yr - i * y1;
        if (remX < 0 || remY < 0) break;

        // does (remX, remY) fit perfectly with x2,y2?
        if (remX % x2 === 0 && remY % y2 === 0) {
          const j = remX / x2;
          if (j >= 0 && remY / y2 === j) {
            results.push([i, j]);
          }
        }
      }
    }
  }
  return results;
};

export function day13() {
  const machines = readInput(13)
    .split('\n\n')
    .map(block => {
      const [x1, y1, x2, y2, xr, yr] = block.match(/\d+/g)!.map(Number);
      return { x1, y1, x2, y2, xr, yr };
    });
  // console.log(machines);

  // Part 1
  console.time();
  const res1 = machines.map(m => partOne(m)).map(r => bestResult(r));
  console.timeEnd();
  // console.log(res1);

  //Part 2
  const machines2 = machines.map(m => ({ ...m, xr: 10000000000000 + m.xr, yr: 10000000000000 + m.yr }));
  console.time();
  const res2 = machines2.map(m => partTwoLinear(m)).map(r => bestResult(r));
  console.timeEnd();
  // console.log(res2);

  console.time();
  const res3 = machines2.map(m => partTwoGpt(m)).map(r => bestResult(r));
  console.timeEnd();
  // console.log(res3);
  console.log(sum(res3));

  return {
    part1: sum(res1),
    part2: sum(res3),
  };
}
