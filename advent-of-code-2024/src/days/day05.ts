import { readInput } from '../utils/input';
import { sum } from '../utils/utils';

type RulesGroup = Record<number, number[]>;

const parseInput = (i: string, delimeter: string = ','): number[][] =>
  i.split('\n').map(i => i.split(delimeter).map(v => parseInt(v)));

const isLower = (rules: RulesGroup, i: number, j: number) => i in rules && rules[i].includes(j);

const isProcedureValid = (procedure: number[], rules: RulesGroup): boolean => {
  for (let i = 0; i < procedure.length - 1; i++) {
    if (!isLower(rules, procedure[i], procedure[i + 1])) {
      return false;
    }
  }
  return true;
};

const fixProcedure = (procedure: number[], rules: RulesGroup): number[] =>
  procedure.sort((a, b) => (isLower(rules, a, b) ? -1 : 1));

export function day05() {
  const [input1, input2] = readInput(5).split('\n\n');

  const procedures = parseInput(input2);
  const rules = parseInput(input1, '|');

  const rulesGrouped = rules.reduce((acc: RulesGroup, values: number[]) => {
    if (!(values[0] in acc)) {
      acc[values[0]] = [];
    }
    acc[values[0]].push(values[1]);
    return acc;
  }, {} as RulesGroup);

  // Part 1
  const res1 = procedures
    .map(p => (isProcedureValid(p, rulesGrouped) ? p : undefined))
    .filter(i => !!i)
    .map(r => r[Math.floor(r.length / 2)]);

  //Part 2
  const res2 = procedures
    .map(p => (isProcedureValid(p, rulesGrouped) ? undefined : fixProcedure(p, rulesGrouped)))
    .filter(i => !!i)
    .map(r => r[Math.floor(r.length / 2)]);

  return {
    part1: sum(res1),
    part2: sum(res2),
  };
}
