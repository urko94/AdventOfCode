import { readInputLines } from '../utils/input';
import { sum } from '../utils/utils';

type touple = [string, string];

/**
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+

    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
 */

const mappingNums = new Map<string, string>();
const mappingNums2 = new Map<string, string>();
const mappingKeypad = new Map<string, string>();

const createMappingNums = (mapping: Map<string, string>) => {
  mapping.set('A_0', '<A');
  mapping.set('A_1', '^<<A');
  mapping.set('A_2', '^<A');
  mapping.set('A_3', '^A');
  mapping.set('A_4', '^^<<A');
  mapping.set('A_5', '^^<A');
  mapping.set('A_6', '^^A');
  mapping.set('A_7', '^^^<<A');
  mapping.set('A_8', '^^^<A');
  mapping.set('A_9', '^^^A');

  mapping.set('0_A', '>A');
  mapping.set('0_1', '^<A');
  mapping.set('0_2', '^A');
  mapping.set('0_3', '^>A');
  mapping.set('0_4', '^^<A');
  mapping.set('0_5', '^^A');
  mapping.set('0_6', '^^>A');
  mapping.set('0_7', '^^^<A');
  mapping.set('0_8', '^^^A');
  mapping.set('0_9', '^^^>A');

  mapping.set('1_A', '>>vA');
  mapping.set('1_0', '>vA');
  mapping.set('1_2', '>A');
  mapping.set('1_3', '>>A');
  mapping.set('1_4', '^A');
  mapping.set('1_5', '^>A');
  mapping.set('1_6', '^>>A');
  mapping.set('1_7', '^^A');
  mapping.set('1_8', '^^>A');
  mapping.set('1_9', '^^>>A');

  mapping.set('2_A', 'v>A');
  mapping.set('2_0', 'vA');
  mapping.set('2_1', '<A');
  mapping.set('2_3', '>A');
  mapping.set('2_4', '^<A');
  mapping.set('2_5', '^A');
  mapping.set('2_6', '^>A');
  mapping.set('2_7', '^^<A');
  mapping.set('2_8', '^^A');
  mapping.set('2_9', '^^>A');

  mapping.set('3_A', 'vA');
  mapping.set('3_0', 'v<A');
  mapping.set('3_1', '<<A');
  mapping.set('3_2', '<A');
  mapping.set('3_4', '^<<A');
  mapping.set('3_5', '^<A');
  mapping.set('3_6', '^A');
  mapping.set('3_7', '^^<<A');
  mapping.set('3_8', '^^<A');
  mapping.set('3_9', '^^A');

  mapping.set('4_A', '>>vvA');
  mapping.set('4_0', '>vvA');
  mapping.set('4_1', 'vA');
  mapping.set('4_2', 'v>A');
  mapping.set('4_3', 'v>>A');
  mapping.set('4_5', '>A');
  mapping.set('4_6', '>>A');
  mapping.set('4_7', '^A');
  mapping.set('4_8', '^>A');
  mapping.set('4_9', '^>>A');

  mapping.set('5_A', 'vv>A');
  mapping.set('5_0', 'vvA');
  mapping.set('5_1', 'v<A');
  mapping.set('5_2', 'vA');
  mapping.set('5_3', 'v>A');
  mapping.set('5_4', '<A');
  mapping.set('5_6', '>A');
  mapping.set('5_7', '^<A');
  mapping.set('5_8', '^A');
  mapping.set('5_9', '^>A');

  mapping.set('6_A', 'vvA');
  mapping.set('6_0', 'vv<A');
  mapping.set('6_1', 'v<<A');
  mapping.set('6_2', 'v<A');
  mapping.set('6_3', 'vA');
  mapping.set('6_4', '<<A');
  mapping.set('6_5', '<A');
  mapping.set('6_7', '^<<A');
  mapping.set('6_8', '^<A');
  mapping.set('6_9', '^A');

  mapping.set('7_A', '>>vvvA');
  mapping.set('7_0', '>vvvA');
  mapping.set('7_1', 'vvA');
  mapping.set('7_2', 'vv>A');
  mapping.set('7_3', 'vv>>A');
  mapping.set('7_4', 'vA');
  mapping.set('7_5', 'v>A');
  mapping.set('7_6', 'v>>A');
  mapping.set('7_8', '>A');
  mapping.set('7_9', '>>A');

  mapping.set('8_A', 'vvv>A');
  mapping.set('8_0', 'vvvA');
  mapping.set('8_1', 'vv<A');
  mapping.set('8_2', 'vvA');
  mapping.set('8_3', 'vv>A');
  mapping.set('8_4', 'v<A');
  mapping.set('8_5', 'vA');
  mapping.set('8_6', 'v>A');
  mapping.set('8_7', '<A');
  mapping.set('8_9', '>A');

  mapping.set('9_A', 'vvvA');
  mapping.set('9_0', 'vvv<A');
  mapping.set('9_1', 'vv<<A');
  mapping.set('9_2', 'vv<A');
  mapping.set('9_3', 'vvA');
  mapping.set('9_4', 'v<<A');
  mapping.set('9_5', 'v<A');
  mapping.set('9_6', 'vA');
  mapping.set('9_7', '<<A');
  mapping.set('9_8', '<A');
};
const createMappingNums2 = (mapping: Map<string, string>) => {
  mapping.set('A_0', '<A');
  mapping.set('A_1', '^<<A');
  mapping.set('A_2', '<^A');
  mapping.set('A_3', '^A');
  mapping.set('A_4', '^^<<A');
  mapping.set('A_5', '<^^A');
  mapping.set('A_6', '^^A');
  mapping.set('A_7', '^^^<<A');
  mapping.set('A_8', '<^^^A');
  mapping.set('A_9', '^^^A');

  mapping.set('0_A', '>A');
  mapping.set('0_1', '^<A');
  mapping.set('0_2', '^A');
  mapping.set('0_3', '>^A');
  mapping.set('0_4', '^^<A');
  mapping.set('0_5', '^^A');
  mapping.set('0_6', '>^^A');
  mapping.set('0_7', '^^^<A');
  mapping.set('0_8', '^^^A');
  mapping.set('0_9', '>^^^A');

  mapping.set('1_A', '>>vA');
  mapping.set('1_0', '>vA');
  mapping.set('1_2', '>A');
  mapping.set('1_3', '>>A');
  mapping.set('1_4', '^A');
  mapping.set('1_5', '>^A');
  mapping.set('1_6', '>>^A');
  mapping.set('1_7', '^^A');
  mapping.set('1_8', '>^^A');
  mapping.set('1_9', '>>^^A');

  mapping.set('2_A', '>vA');
  mapping.set('2_0', 'vA');
  mapping.set('2_1', '<A');
  mapping.set('2_3', '>A');
  mapping.set('2_4', '<^A');
  mapping.set('2_5', '^A');
  mapping.set('2_6', '>^A');
  mapping.set('2_7', '<^^A');
  mapping.set('2_8', '^^A');
  mapping.set('2_9', '>^^A');

  mapping.set('3_A', 'vA');
  mapping.set('3_0', '<vA');
  mapping.set('3_1', '<<A');
  mapping.set('3_2', '<A');
  mapping.set('3_4', '<<^A');
  mapping.set('3_5', '<^A');
  mapping.set('3_6', '^A');
  mapping.set('3_7', '<<^^A');
  mapping.set('3_8', '<^^A');
  mapping.set('3_9', '^^A');

  mapping.set('4_A', '>>vvA');
  mapping.set('4_0', '>vvA');
  mapping.set('4_1', 'vA');
  mapping.set('4_2', '>vA');
  mapping.set('4_3', '>>vA');
  mapping.set('4_5', '>A');
  mapping.set('4_6', '>>A');
  mapping.set('4_7', '^A');
  mapping.set('4_8', '>^A');
  mapping.set('4_9', '>>^A');

  mapping.set('5_A', '>vvA');
  mapping.set('5_0', 'vvA');
  mapping.set('5_1', '<vA');
  mapping.set('5_2', 'vA');
  mapping.set('5_3', '>vA');
  mapping.set('5_4', '<A');
  mapping.set('5_6', '>A');
  mapping.set('5_7', '<^A');
  mapping.set('5_8', '^A');
  mapping.set('5_9', '>^A');

  mapping.set('6_A', 'vvA');
  mapping.set('6_0', '<vvA');
  mapping.set('6_1', '<<vA');
  mapping.set('6_2', '<vA');
  mapping.set('6_3', 'vA');
  mapping.set('6_4', '<<A');
  mapping.set('6_5', '<A');
  mapping.set('6_7', '<<^A');
  mapping.set('6_8', '<^A');
  mapping.set('6_9', '^A');

  mapping.set('7_A', '>>vvvA');
  mapping.set('7_0', '>vvvA');
  mapping.set('7_1', 'vvA');
  mapping.set('7_2', '>vvA');
  mapping.set('7_3', '>>vvA');
  mapping.set('7_4', 'vA');
  mapping.set('7_5', '>vA');
  mapping.set('7_6', '>>vA');
  mapping.set('7_8', '>A');
  mapping.set('7_9', '>>A');

  mapping.set('8_A', '>vvvA');
  mapping.set('8_0', 'vvvA');
  mapping.set('8_1', '<vvA');
  mapping.set('8_2', 'vvA');
  mapping.set('8_3', '>vvA');
  mapping.set('8_4', '<vA');
  mapping.set('8_5', 'vA');
  mapping.set('8_6', '>vA');
  mapping.set('8_7', '<A');
  mapping.set('8_9', '>A');

  mapping.set('9_A', 'vvvA');
  mapping.set('9_0', '<vvvA');
  mapping.set('9_1', '<<vvA');
  mapping.set('9_2', '<vvA');
  mapping.set('9_3', 'vvA');
  mapping.set('9_4', '<<vA');
  mapping.set('9_5', '<vA');
  mapping.set('9_6', 'vA');
  mapping.set('9_7', '<<A');
  mapping.set('9_8', '<A');
};

const createMappingKeypad = (mapping: Map<string, string>) => {
  mappingKeypad.set('A_A', 'A');
  mappingKeypad.set('A_^', '<A');
  mappingKeypad.set('A_<', 'v<<A');
  mappingKeypad.set('A_v', '<vA');
  mappingKeypad.set('A_>', 'vA');

  mappingKeypad.set('^_^', 'A');
  mappingKeypad.set('^_A', '>A');
  mappingKeypad.set('^_<', 'v<A');
  mappingKeypad.set('^_v', 'vA');
  mappingKeypad.set('^_>', 'v>A');

  mappingKeypad.set('<_<', 'A');
  mappingKeypad.set('<_A', '>>^A');
  mappingKeypad.set('<_^', '>^A');
  mappingKeypad.set('<_v', '>A');
  mappingKeypad.set('<_>', '>>A');

  mappingKeypad.set('v_v', 'A');
  mappingKeypad.set('v_A', '>^A');
  mappingKeypad.set('v_^', '^A');
  mappingKeypad.set('v_<', '<A');
  mappingKeypad.set('v_>', '>A');

  mappingKeypad.set('>_>', 'A');
  mappingKeypad.set('>_A', '^A');
  mappingKeypad.set('>_^', '^<A');
  mappingKeypad.set('>_<', '<<A');
  mappingKeypad.set('>_v', '<A');
};

const createCombinations = (values: touple[], i = 0, out: string[] = [], str = ''): string[] => {
  if (i >= values.length) {
    if (!out.includes(str)) out.push(str);
    return out;
  }

  values[i].forEach(v => {
    createCombinations(values, i + 1, out, str + v);
  });
  return out;
};

const expandSequence = (seq: string[], mapping: Map<string, string>): string[] => {
  let out: string[] = [];
  for (let k = 0; k < seq.length; k++) {
    const key = k === 0 ? `A_${seq[k]}` : `${seq[k - 1]}_${seq[k]}`;
    const val = mapping.get(key);
    if (!val) throw new Error(`No mapping for ${key}`);
    out.push(...val.split(''));
  }
  console.log(out.length);
  return out;
};
const expandSequenceDouble = (seq: string[], mapping: Map<string, string>, mapping2: Map<string, string>): string[] => {
  let values: touple[] = [];
  for (let k = 0; k < seq.length; k++) {
    const key = k === 0 ? `A_${seq[k]}` : `${seq[k - 1]}_${seq[k]}`;
    const val = mapping.get(key);
    const val2 = mapping2.get(key);
    if (!val || !val2) throw new Error(`No mapping for ${key}`);
    values.push([val, val2]);
  }
  return createCombinations(values);
};
const expandSequenceStr = (seq: string, mapping: Map<string, string>): string => {
  let out: string = '';
  for (let k = 0; k < seq.length; k++) {
    const key = k === 0 ? `A_${seq.charAt(k)}` : `${seq.charAt(k - 1)}_${seq.charAt(k)}`;
    const val = mapping.get(key);
    if (!val) throw new Error(`No mapping for ${key}`);
    out += val;
  }
  console.log(out.length);
  return out;
};

const cache = new Map<string, number>();
function expandedLength(seq: string[], depth: number, mapping: Map<string, string>): number {
  if (depth === 0) return seq.length;

  let total = 0;
  for (let i = 0; i < seq.length; i++) {
    const prev = i === 0 ? 'A' : seq[i - 1];
    const cur = seq[i];
    const key = `${prev}_${cur}`;
    const val = mapping.get(key);
    if (!val) throw new Error(`No mapping for ${key}`);

    const cacheKey = `${val}_${depth}`;
    if (cache.has(cacheKey)) {
      total += cache.get(cacheKey)!;
    } else {
      const subLen = expandedLength(val.split(''), depth - 1, mapping);
      cache.set(cacheKey, subLen);
      total += subLen;
    }
  }
  return total;
}

export function day21(day: number, test: boolean) {
  const lines = readInputLines(day, test);
  console.log(lines);

  createMappingNums(mappingNums);
  createMappingNums2(mappingNums2);
  createMappingKeypad(mappingKeypad);

  // Part 1
  /**
  One directional keypad that you are using.
  Two directional keypads that robots are using.
  One numeric keypad (on a door) that a robot is using.
   */
  console.time();
  const res1 = lines.map(line => {
    const digits = line.split('');

    // const numSeq = expandSequence(digits, mappingNums);
    const numSeqs = expandSequenceDouble(digits, mappingNums, mappingNums2);

    const results = numSeqs.map(seq => {
      const keySeq = expandSequence(seq.split(''), mappingKeypad);
      return expandSequence(keySeq, mappingKeypad);
    });
    const actionsSeq = results.reduce((a, r) => (r.length < a.length ? r : a), results[0]);

    const codeNum = Number(line.match(/\d+/)?.[0]);
    return codeNum * actionsSeq.length;
  });
  console.timeEnd();

  //Part 2
  /**
   * One directional keypad that you are using.
   * 25 directional keypads that robots are using.
   * One numeric keypad (on a door) that a robot is using.
   */
  console.time();
  const res2 = lines.map(line => {
    const digits = line.split('');

    // const numSeq = expandSequence(digits, mappingNums);
    const numSeqs = expandSequenceDouble(digits, mappingNums, mappingNums2);

    const results = numSeqs.map(seq => {
      let input = seq;
      // for (let i = 0; i < 25; i++) {
      //   input = expandSequenceStr(input, mappingKeypad);
      // }

      return expandedLength(seq.split(''), 25, mappingKeypad);
    });
    console.log(results);
    const actionsSeq = results.reduce((a, r) => (r < a ? r : a), Number.MAX_SAFE_INTEGER);

    const codeNum = Number(line.match(/\d+/)?.[0]);
    return codeNum * actionsSeq;
  });
  console.timeEnd();

  /**
   * Wrong: 390257147770620, 379817059650820
   * 260586897262600
   */
  return {
    part1: sum(res1),
    part2: sum(res2),
  };
}
