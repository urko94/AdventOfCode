import { readInput } from '../utils/input';
import { sum } from '../utils/utils';
import { Part, Rule, WorkflowDefinition, Operator, RangeSet, RangeSets, WorkflowSystem } from '../utils/Workflow';

type Workflows = Record<string, WorkflowDefinition>;

const parseWorkflow = (workflows: Workflows, input: string) => {
  const [name, body] = input.split('{');
  const content = body.replace('}', '');

  const parts = content.split(',');
  const rules: Rule[] = [];
  let fallback: string = '';

  for (const segment of parts) {
    if (segment.includes(':')) {
      // Conditional rule: e.g. a<2006:qkq
      const match = segment.match(/^([xmas])([<>])(\d+):(\w+)$/);
      if (!match) throw new Error(`Invalid rule format: ${segment}`);
      const [, category, operator, value, destination] = match;
      rules.push({
        category: category as any,
        operator: operator as any,
        value: parseInt(value),
        destination,
      });
    } else {
      // Fallback (final destination)
      fallback = segment;
    }
  }

  workflows[name] = { name, rules, fallback };
};

function parseValues(line: string): Part {
  const matches = line.matchAll(/([xmas])=(\d+)/g);
  const part: any = {};

  for (const [, key, value] of matches) {
    part[key] = parseInt(value);
  }

  return part as Part;
}

const sumValues = (values: Part) => sum(Object.values(values));
const isRuleValid = (r: Rule, values: Part) =>
  r.operator === Operator.LOWER ? values[r.category] < r.value : values[r.category] > r.value;

const checkRules = (rules: Rule[], fallback: string, part: Part) => {
  for (const rule of rules) {
    if (isRuleValid(rule, part)) return rule.destination;
  }
  return fallback;
};

const partOne = (workflows: Workflows, values: Part): number => {
  let workflowName = 'in';

  while (workflowName in workflows) {
    const { fallback, rules } = workflows[workflowName];

    const r = checkRules(rules, fallback, values);
    if (r === 'R') return 0;
    if (r === 'A') return sumValues(values);

    workflowName = r;
  }
  return workflowName === 'A' ? sumValues(values) : 0;
};

const partTwo = (workflows: Workflows, parts: Part[]) => {
  const values: RangeSets = {
    x: [],
    m: [],
    a: [],
    s: [],
  };

  for (let wf in workflows) {
    const { fallback, rules } = workflows[wf];
    for (const rule of rules) {
      if (fallback === 'A') {
        if (rule.destination === 'A') {
          // any values
          values[rule.category].push({ min: 0, max: 4000 });
        } else {
          if (rule.operator === Operator.LARGER) {
            values[rule.category].push({ min: 0, max: rule.value - 1 });
          } else {
            values[rule.category].push({ min: rule.value + 1, max: 4000 });
          }
        }
      } else if (fallback === 'R') {
        if (rule.destination === 'A') {
          if (rule.operator === Operator.LOWER) {
            values[rule.category].push({ min: 0, max: rule.value - 1 });
          } else {
            values[rule.category].push({ min: rule.value + 1, max: 4000 });
          }
        } else {
        }
      }
    }
  }
  console.log(values);
};

export function countAccepted(workflows: Workflows): number {
  const initial: RangeSet = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  };

  return countFromWorkflow(workflows, 'in', initial);
}
function countFromWorkflow(workflows: Workflows, name: string, ranges: RangeSet): number {
  if (name === 'A') return countRange(ranges);
  if (name === 'R') return 0;

  if (!(name in workflows)) throw new Error(`Unknown workflow: ${name}`);
  const wf = workflows[name];

  let total = 0;
  let current = { ...ranges };

  for (const rule of wf.rules) {
    const [trueRange, falseRange] = splitRange(current, rule);

    // True branch → go to destination
    if (trueRange) {
      total += countFromWorkflow(workflows, rule.destination, trueRange);
    }

    // Continue testing on false branch
    if (!falseRange) return total;
    current = falseRange;
  }

  // After all rules, use fallback
  total += countFromWorkflow(workflows, wf.fallback, current);
  return total;
}

function splitRange(ranges: RangeSet, rule: Rule): [RangeSet?, RangeSet?] {
  const { category, operator, value } = rule;
  const r = ranges[category];

  if (operator === '<') {
    if (r.max < value) return [ranges, undefined]; // whole range passes
    if (r.min >= value) return [undefined, ranges]; // whole range fails

    // Split
    const trueRange = structuredClone(ranges);
    trueRange[category] = { min: r.min, max: value - 1 };

    const falseRange = structuredClone(ranges);
    falseRange[category] = { min: value, max: r.max };

    return [trueRange, falseRange];
  }

  if (operator === '>') {
    if (r.min > value) return [ranges, undefined];
    if (r.max <= value) return [undefined, ranges];

    const trueRange = structuredClone(ranges);
    trueRange[category] = { min: value + 1, max: r.max };

    const falseRange = structuredClone(ranges);
    falseRange[category] = { min: r.min, max: value };

    return [trueRange, falseRange];
  }

  return [undefined, ranges];
}
function countRange(ranges: RangeSet): number {
  return (
    (ranges.x.max - ranges.x.min + 1) *
    (ranges.m.max - ranges.m.min + 1) *
    (ranges.a.max - ranges.a.min + 1) *
    (ranges.s.max - ranges.s.min + 1)
  );
}

export function day19(day: number, test: boolean) {
  const [iW, iV] = readInput(day, test).split('\n\n');

  const workflows: Workflows = {};
  iW.split('\n').forEach(l => parseWorkflow(workflows, l));

  const values = iV.split('\n').map(l => parseValues(l));

  // Part 1
  const res1 = values.map(v => partOne(workflows, v));

  // Part 2
  const res2 = countAccepted(workflows);

  return {
    part1: sum(res1),
    part2: res2,
  };
}
