import { readInput } from '../utils/input';
import { isOdd } from '../utils/utils';

const rearrangeBlokcs = (blocks: number[]) => {
  let lastIdx = blocks.length - 1;
  for (let idx = 0; idx < blocks.length && idx < lastIdx; idx++) {
    if (blocks[idx] === -1) {
      while (lastIdx > idx && blocks[lastIdx] === -1) {
        lastIdx--;
      }
      if (lastIdx > idx) {
        blocks[idx] = blocks[lastIdx];
        blocks[lastIdx] = -1;
        lastIdx--;
      }
    }
  }
  return blocks;
};

const createBlocks = (input: string[]) =>
  input.map((i: string, idx: number) => Array(parseInt(i)).fill(isOdd(idx) ? -1 : Math.floor(idx / 2)));

const checksum = (blocks: number[]) =>
  blocks.reduce((acc: number, curr: number, idx: number) => (curr > 0 ? acc + curr * idx : acc), 0);

const partOne = (input: string[]) => {
  const blocks = rearrangeBlokcs(createBlocks(input).flat());
  return checksum(blocks.filter(b => b !== -1));
};

const partTwo = (input: string[]) => {
  const blocks = createBlocks(input).filter(b => b.length);

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i][0] === -1) {
      let lastIdx = blocks.length - 1;
      while ((lastIdx > i && blocks[lastIdx][0] === -1) || blocks[i].length < blocks[lastIdx].length) {
        lastIdx--;
      }
      if (lastIdx > i) {
        if (blocks[i].length === blocks[lastIdx].length) {
          for (let j = 0; j < blocks[lastIdx].length; j++) {
            blocks[i][j] = blocks[lastIdx][j];
            blocks[lastIdx][j] = -1;
          }
        } else {
          const lastBlock = blocks.splice(lastIdx, 1)[0];
          const block = blocks[i].splice(0, lastBlock.length);
          blocks.splice(i, 0, lastBlock);
          blocks.splice(lastIdx + 1, 0, block);
        }
      }
    }
  }
  return checksum(blocks.flat());
};

export function day09() {
  const input = readInput(9).split('');

  // Part 1
  const res = partOne(input);

  //Part 2
  const res2 = partTwo(input);

  return {
    part1: res,
    part2: res2,
  };
}
