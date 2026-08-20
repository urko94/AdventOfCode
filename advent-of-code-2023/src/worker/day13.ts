import { parentPort } from 'worker_threads';
import { Actions, Machine } from '../days/day13';

const partTwo = (machine: Machine): Actions[] => {
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

parentPort?.on('message', (machine: Machine) => {
  const res = partTwo(machine);
  parentPort?.postMessage(res);
});
