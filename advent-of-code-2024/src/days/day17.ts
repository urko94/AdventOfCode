import { readInput } from '../utils/input';

type Instruction = {
  code: number;
  operand: number;
};

const partOne = (a: number, b: number, c: number, program: Instruction[]) => {
  const res: number[] = [];
  let step = 0;
  let counter = 0;
  while (step < program.length) {
    counter++;
    const p = program[step];
    const getOperandValue = (n: number) => (n < 4 ? n : n === 4 ? a : n === 5 ? b : n === 6 ? c : 0);
    if (p.code === 0) {
      a = Math.floor(a / Math.pow(2, getOperandValue(p.operand)));
    } else if (p.code === 1) {
      b = b ^ p.operand;
    } else if (p.code === 2) {
      b = getOperandValue(p.operand) % 8;
    } else if (p.code === 3 && a > 0) {
      step = p.operand;
      continue;
    } else if (p.code === 4) {
      b = b ^ c;
    } else if (p.code === 5) {
      res.push(getOperandValue(p.operand) % 8);
    } else if (p.code === 6) {
      b = a / Math.pow(2, getOperandValue(p.operand));
    } else if (p.code === 7) {
      c = a / Math.pow(2, getOperandValue(p.operand));
    }
    step++;
  }

  return res;
};
function runProgram(A: number, B: number, C: number, program: number[]) {
  const outputs = [];
  let pc = 0;

  const getCombo = (operand: number) => {
    if (operand <= 3) return operand;
    if (operand === 4) return A;
    if (operand === 5) return B;
    if (operand === 6) return C;
    throw new Error('Invalid combo operand: ' + operand);
  };

  while (pc < program.length) {
    const opcode = program[pc];
    const operand = program[pc + 1];

    switch (opcode) {
      case 0: // adv
        A = Math.floor(A / Math.pow(2, getCombo(operand)));
        break;
      case 1: // bxl
        B = B ^ operand; // literal
        break;
      case 2: // bst
        B = getCombo(operand) % 8;
        break;
      case 3: // jnz
        if (A !== 0) {
          pc = operand;
          continue;
        }
        break;
      case 4: // bxc
        B = B ^ C;
        break;
      case 5: // out
        outputs.push(getCombo(operand) % 8);
        break;
      case 6: // bdv
        B = Math.floor(A / Math.pow(2, getCombo(operand)));
        break;
      case 7: // cdv
        C = Math.floor(A / Math.pow(2, getCombo(operand)));
        break;
      default:
        throw new Error('Unknown opcode ' + opcode);
    }

    pc += 2;
  }

  return outputs;
}
function findSmallestA(program: number[], B = 0, C = 0) {
  for (let A = 0; A < 1e7; A++) {
    // adjust upper bound if needed
    const output = runProgram(A, B, C, program);
    if (output.length === program.length && output.every((v, i) => v === program[i])) {
      return A;
    }
  }
  return null; // not found in search range
}
function search(program: number[], B = 0, C = 0) {
  let candidates = [0n]; // BigInt, build A backwards
  for (let i = program.length - 1; i >= 0; i--) {
    const newCands = [];
    for (const cand of candidates) {
      for (let d = 0n; d < 8n; d++) {
        const A = (cand << 3n) | d; // append digit in base-8
        const out = runProgram(Number(A), B, C, program);
        if (out.slice(i).toString() === program.slice(i).toString()) {
          newCands.push(A);
        }
      }
    }
    candidates = newCands;
  }
  return candidates.length ? candidates.reduce((a, b) => (a < b ? a : b)) : null;
}

let output = '';
let register: bigint[] = [0n, 0n, 0n];
function executeInstruction(pointer: number, opcode: number, operand: number): number {
  // Combo operand resolution (C# combine)
  const comboOperand: bigint = operand > 3 ? register[operand - 4] : BigInt(operand);

  switch (opcode) {
    case 0: // adv
      register[0] /= 2n ** comboOperand;
      return pointer + 2;

    case 1: // bxl
      register[1] = register[1] ^ BigInt(operand);
      return pointer + 2;

    case 2: // bst
      register[1] = comboOperand % 8n;
      return pointer + 2;

    case 3: // jnz
      if (register[0] === 0n) return pointer + 2;
      return operand;

    case 4: // bxc
      register[1] = register[1] ^ register[2];
      return pointer + 2;

    case 5: // ovt
      output += `${comboOperand % 8n},`;
      return pointer + 2;

    case 6: // bdv
      register[1] = register[0] / 2n ** comboOperand;
      return pointer + 2;

    case 7: // cdv
      register[2] = register[0] / 2n ** comboOperand;
      return pointer + 2;

    default:
      return -1;
  }
}
function runProgram2(A: bigint, program: number[]): string {
  let reg: bigint[] = [A, 0n, 0n];
  let pointer = 0;
  let out = '';

  while (pointer < program.length) {
    const opcode = program[pointer];
    const operand = program[pointer + 1];
    const combo = operand > 3 ? reg[operand - 4] : BigInt(operand);

    switch (opcode) {
      case 0:
        reg[0] /= 2n ** combo;
        pointer += 2;
        break;
      case 1:
        reg[1] = reg[1] ^ BigInt(operand);
        pointer += 2;
        break;
      case 2:
        reg[1] = combo % 8n;
        pointer += 2;
        break;
      case 3:
        pointer = reg[0] === 0n ? pointer + 2 : operand;
        break;
      case 4:
        reg[1] = reg[1] ^ reg[2];
        pointer += 2;
        break;
      case 5:
        out += `${combo % 8n},`;
        pointer += 2;
        break;
      case 6:
        reg[1] = reg[0] / 2n ** combo;
        pointer += 2;
        break;
      case 7:
        reg[2] = reg[0] / 2n ** combo;
        pointer += 2;
        break;
    }
  }
  return out;
}

export function day17(day: number, test: boolean) {
  const [input1, input2] = readInput(day, test).split('\n\n');

  const [a, b, c] = input1 ? input1.match(/\d+/g)!.map(Number) : [0, 0, 0];
  const numbers = input2.split(': ')[1].split(',').map(Number);
  const program = numbers.reduce((acc: Instruction[], curr, idx) => {
    if (idx % 2 === 1) {
      acc.push({ code: numbers[idx - 1], operand: curr });
    }
    return acc;
  }, []);

  console.log(a, b, c);
  console.log(program);

  // Part 1
  const res1 = partOne(a, b, c, program);

  //Part 2
  let res2 = 0;
  // console.log('Part 2:', findSmallestA(numbers));
  // console.log('Part 2:', search(numbers));

  // while (res2 <= 1000000000) {
  //   const res = partOne(res2, b, c, program);
  //   if (res.length === numbers.length && res.join(',') === numbers.join(',')) {
  //     break;
  //   }
  //   res2++;
  // }
  let answers: bigint[] = [0n];
  let target = numbers.join(','); // program as output

  for (let i = program.length - 1; i >= 0; i--) {
    let newAnswers: bigint[] = [];

    for (let a of answers) {
      for (let d = 0n; d < 8n; d++) {
        let candidate = a * 8n + d;
        let out = runProgram2(candidate, numbers);
        if (out.endsWith(target.slice(i * 2))) {
          newAnswers.push(candidate);
        }
      }
    }
    answers = newAnswers;
  }
  console.log(answers);

  return {
    part1: res1.join(','),
    part2: answers.sort((x, y) => (x < y ? -1 : 1))[0], // 216148338630253
  };
}
