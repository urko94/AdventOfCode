import { readInput } from "../utils/input";

export function day03() {
  const input = readInput(3);

  // Part 1
  const regex = /mul\((\d+),(\d+)\)/g;
  const matches = [...input.matchAll(regex)];
  const res = matches.map((m) => {
    const [_, x, y] = m;
    return parseInt(x) * parseInt(y);
  });

  //Part 2
  const regex2 = /mul\((\d+),(\d+)\)|do\(\)|don\'t\(\)/g;
  const matches2 = [...input.matchAll(regex2)];
  let enabled = true;
  const res2 = matches2.map((m) => {
    const [instruction, x, y] = m;
    if (instruction === "do()") enabled = true;
    else if (instruction === "don't()") enabled = false;
    else if (enabled && instruction.startsWith("mul")) return parseInt(x) * parseInt(y);
    return 0;
  });

  return {
    part1: res.reduce((acc, curr) => acc + curr, 0),
    part2: res2.reduce((acc, curr) => acc + curr, 0),
  };
}
