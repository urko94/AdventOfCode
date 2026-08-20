export enum Operator {
  LOWER = '<',
  LARGER = '>',
}
export type Category = 'x' | 'm' | 'a' | 's';
export interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}
export type Destination = string | 'A' | 'R';
export type Range = { min: number; max: number };
export type RangeSet = Record<'x' | 'm' | 'a' | 's', Range>;
export type RangeSets = Record<'x' | 'm' | 'a' | 's', Range[]>;
export type RangeValues = Record<'x' | 'm' | 'a' | 's', number[]>;

export interface Rule {
  category: Category;
  operator: string;
  value: number;
  destination: Destination;
}
export interface WorkflowDefinition {
  name: string;
  rules: Rule[];
  fallback: Destination;
}

export class Workflow {
  name: string;
  rules: Rule[];
  fallback: Destination;

  constructor(def: WorkflowDefinition) {
    this.name = def.name;
    this.rules = def.rules;
    this.fallback = def.fallback;
  }

  process(part: Part): Destination {
    for (const rule of this.rules) {
      const value = part[rule.category];
      const condition = rule.operator === '<' ? value < rule.value : value > rule.value;

      if (condition) return rule.destination;
    }
    return this.fallback;
  }
}

export class WorkflowSystem {
  workflows: Map<string, Workflow> = new Map();

  addWorkflow(workflow: Workflow) {
    this.workflows.set(workflow.name, workflow);
  }

  evaluate(part: Part): 'A' | 'R' {
    let current = 'in';

    while (true) {
      const wf = this.workflows.get(current);
      if (!wf) throw new Error(`Unknown workflow: ${current}`);

      const next = wf.process(part);
      if (next === 'A' || next === 'R') return next;
      current = next;
    }
  }
}
