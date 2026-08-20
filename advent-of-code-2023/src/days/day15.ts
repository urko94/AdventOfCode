import { readInput } from '../utils/input';
import { printGrid } from '../utils/output';
import { sum } from '../utils/utils';

type Box = { label: string; focal: number };

const hash = (input: string) => {
  return input.split('').reduce((acc, curr) => {
    const asciiVal = curr.charCodeAt(0);
    return (17 * (acc + asciiVal)) % 256;
  }, 0);
};
const partTwo = (boxes: Box[][], input: string) => {
  const match = input.match(/^([a-z]+)(=|–|-)(\d+)?$/);
  if (!match) return 0;

  const [, label, op, val] = match;
  const boxId = hash(label);
  const box = boxes[boxId];

  if (op === '=') {
    const focal = Number(val);
    const existing = box.find(l => l.label === label);
    if (existing) existing.focal = focal;
    else box.push({ label, focal });
  } else if (op === '-') {
    const idx = box.findIndex(l => l.label === label);
    if (idx !== -1) box.splice(idx, 1);
  }
};

export function day15(day: number, test: boolean) {
  const lines = readInput(day, test).split(',');

  // Part 1
  const res1 = lines.map(l => hash(l));

  // Part 2
  const boxes = Array.from({ length: 256 }, () => [] as Box[]);
  lines.forEach(l => partTwo(boxes, l));
  const res2 = boxes.reduce(
    (sum, box, b) => sum + box.reduce((s, { focal }, i) => s + (b + 1) * (i + 1) * focal, 0),
    0
  );

  return {
    part1: sum(res1),
    part2: res2,
  };
}
