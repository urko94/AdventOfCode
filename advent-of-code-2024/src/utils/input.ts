import { readFileSync } from 'fs';
import { join } from 'path';

export function readInput(day: number, test = false): string {
  const filePath = join(
    __dirname,
    '../../inputs/',
    `${test ? 'test' : 'data'}/day${day.toString().padStart(2, '0')}.txt`
  );
  let data = readFileSync(filePath, 'utf-8');
  return data.trim().replace(/\r/g, '');
}

export function readInputLines(day: number, test = false): string[] {
  return readInput(day, test).split('\n');
}
export function readMap(day: number, test = false, delimeter: string = ' '): number[][] {
  const lines = readInput(day, test).split('\n');
  return lines.map(l => l.split(delimeter).map(i => parseInt(i)));
}
export function readColumns(day: number, test = false): string[][] {
  const lines = readInputLines(day, test).map(line => line.split(''));
  return lines[0].map((_, colIndex) => lines.map(row => row[colIndex]));
}
export function readColumnsNumeric(day: number, test = false): number[][] {
  const lines = readInputLines(day, test).map(line => line.split('   '));
  return lines[0].map((_, colIndex) => lines.map(row => parseInt(row[colIndex])));
}
