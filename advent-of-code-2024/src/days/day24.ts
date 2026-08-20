import { readInput } from '../utils/input';

type GateType = 'AND' | 'OR' | 'XOR';

class Gate {
  name: string; // Output wire name (e.g. "z00")
  type: GateType; // Type of gate (AND/OR/XOR)
  inputA: string; // First input wire
  inputB: string; // Second input wire

  constructor(name: string, type: GateType, inputA: string, inputB: string) {
    this.name = name;
    this.type = type;
    this.inputA = inputA;
    this.inputB = inputB;
  }
}

class Circuit {
  private wires: Map<string, number>; // stores known wire values
  private gates: Gate[];

  constructor() {
    this.wires = new Map();
    this.gates = [];
  }

  setWire(name: string, value: number): void {
    this.wires.set(name, value);
  }

  addGate(name: string, type: GateType, inputA: string, inputB: string): void {
    this.gates.push(new Gate(name, type, inputA, inputB));
  }

  private evalGate(gate: Gate): boolean {
    if (!this.wires.has(gate.inputA) || !this.wires.has(gate.inputB)) {
      return false;
    }

    const a = this.wires.get(gate.inputA)!;
    const b = this.wires.get(gate.inputB)!;
    const result = evalGate(gate, a, b);

    this.wires.set(gate.name, result);
    return true;
  }

  run(): void {
    let progress = true;
    while (progress) {
      progress = false;
      for (const gate of this.gates) {
        if (!this.wires.has(gate.name)) {
          const ok = this.evalGate(gate);
          if (ok) progress = true;
        }
      }
    }
  }

  getWire(name: string): number | undefined {
    return this.wires.get(name);
  }
}

class Gate2 {
  name: string;
  type: string;
  in1: string;
  in2: string;
  out: string;

  constructor(type: string, in1: string, in2: string, out: string) {
    this.type = type;
    this.in1 = in1;
    this.in2 = in2;
    this.out = out;
    this.name = `${out}`; // use output wire as ID
  }

  eval(values: Map<string, number>): boolean {
    if (!values.has(this.in1) || !values.has(this.in2)) return false;

    const a = values.get(this.in1)!;
    const b = values.get(this.in2)!;
    let res = 0;
    switch (this.type) {
      case 'AND':
        res = a & b;
        break;
      case 'OR':
        res = a | b;
        break;
      case 'XOR':
        res = a ^ b;
        break;
    }
    values.set(this.out, res);
    return true;
  }
}

class CircuitDebugger {
  gates: Gate2[];
  values: Map<string, number>;

  constructor(gates: Gate2[]) {
    this.gates = gates;
    this.values = new Map();
  }

  run(inputs: Map<string, number>): Map<string, number> {
    this.values = new Map(inputs);
    let progress = true;
    while (progress) {
      progress = false;
      for (const g of this.gates) {
        if (!this.values.has(g.out)) {
          const ok = g.eval(this.values);
          if (ok) progress = true;
        }
      }
    }
    return this.values;
  }

  debug(x: number, y: number, bits: number) {
    // load inputs
    const inputs = new Map<string, number>();
    for (let i = 0; i < bits; i++) {
      inputs.set(`x${i.toString().padStart(2, '0')}`, (x >> i) & 1);
      inputs.set(`y${i.toString().padStart(2, '0')}`, (y >> i) & 1);
    }

    const outputs = this.run(inputs);

    // expected result
    const expected = x + y;

    for (let i = 0; i < bits; i++) {
      const wire = `z${i.toString().padStart(2, '0')}`;
      const actual = outputs.get(wire);
      const expBit = (expected >> i) & 1;

      if (actual !== expBit) {
        console.log(`❌ Mismatch at ${wire}: got ${actual}, expected ${expBit}`);
      } else {
        console.log(`✅ ${wire} correct`);
      }
    }
  }
}

const evalGate = (gate: Gate, a: number, b: number) => {
  switch (gate.type) {
    case 'AND':
      return a & b;
    case 'OR':
      return a | b;
    case 'XOR':
      return a ^ b;
    default:
      throw new Error(`Unknown gate type: ${gate.type}`);
  }
};

export function day24(day: number, test: boolean) {
  const [input1, input2] = readInput(day, test).split('\n\n');

  // Part 1
  const wires: Record<string, number> = {};
  input1.split('\n').forEach(l => {
    const [wire, value] = l.split(':');
    wires[wire] = Number(value);
  });
  // console.log(wires);

  const gates: Gate[] = [];
  input2.split('\n').forEach(l => {
    const [inputA, type, inputB, _, name] = l.split(' ');
    gates.push(new Gate(name, type as GateType, inputA, inputB));
  });
  // console.log(gates);

  let i = 0;
  while (gates.length) {
    if (i >= gates.length) i = 0;

    const gate = gates[i];
    if (Object.keys(wires).includes(gate.inputA) && Object.keys(wires).includes(gate.inputB)) {
      wires[gate.name] = evalGate(gate, wires[gate.inputA], wires[gate.inputB]);
      gates.splice(i, 1);
    } else {
      i++;
    }
  }
  const res1: number[] = [];
  Object.entries(wires).forEach(([key, value]) => {
    if (key.includes('z')) {
      res1[Number(Number(key.match(/\d+/g)))] = value;
    }
  });

  // Part 2
  const gates2: Gate2[] = []; // build Gate objects
  input2.split('\n').forEach(l => {
    const [inputA, type, inputB, _, name] = l.split(' ');
    gates2.push(new Gate2(type, inputA, inputB, name));
  });
  const dbg = new CircuitDebugger(gates2);

  // Try small inputs first (like 1 + 1, 2 + 3, etc)
  dbg.debug(2, 3, 45); // 45 bits in your real puzzle

  return {
    part1: parseInt(res1.reverse().join(''), 2),
    part2: 0,
  };
}
