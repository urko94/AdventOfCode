import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

export function printMap(data: number[][], n = 7) {
  data.forEach(row => {
    console.log(row.map(num => String(num).padStart(n, ' ')).join(''));
  });
}
export function printGrid(data: Array<any>) {
  data.forEach(row => {
    console.log(row.join(' '));
  });
}
export function printLines(data: Array<any>) {
  data.forEach(line => {
    console.log(line);
  });
}

export const writeToFile = (map: Array<Array<string | number>>, fileName = 'output.txt', n = 2): string => {
  const outDir = join(__dirname, '../../outputs');
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  const filePath = join(outDir, fileName);
  const lines = map.map(row => row.map(cell => String(cell).padStart(n, ' ')).join(''));
  writeFileSync(filePath, lines.join('\n'), 'utf-8');
  return filePath;
};
