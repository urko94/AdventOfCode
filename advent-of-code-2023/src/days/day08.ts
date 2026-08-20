import { readInput } from '../utils/input';
import { lcm, lcmArray } from '../utils/utils';

type Node = {
  left: string;
  right: string;
};

const directionLeft = (directions: string, step: number) =>
  directions[step % directions.length] === 'L' ? true : false;

const nodesEndsWith = (nodes: Map<string, Node>, suffix: string) => {
  const result: string[] = [];
  for (const [key] of nodes) {
    if (key.endsWith(suffix)) {
      result.push(key);
    }
  }
  return result;
};

const partOne = (directions: string, nodes: Map<string, Node>) => {
  let step = 0;
  let nodeName = 'AAA';

  while (nodeName !== 'ZZZ') {
    const left = directionLeft(directions, step);
    const currentNode = nodes.get(nodeName);
    if (!currentNode) break;
    nodeName = left ? currentNode.left : currentNode.right;
    step++;
  }
  return step;
};

const partTwo = (directions: string, nodes: Map<string, Node>) => {
  let currentNodes = nodesEndsWith(nodes, 'A');
  let steps = Array.from({ length: currentNodes.length }, () => 0);

  currentNodes.map((nodeName, i) => {
    while (nodeName.endsWith('Z') === false) {
      const left = directionLeft(directions, steps[i]);
      const currentNode = nodes.get(nodeName);
      if (!currentNode) break;
      nodeName = left ? currentNode.left : currentNode.right;
      steps[i]++;
    }
  });

  return steps;
};

export function day08(day: number, test: boolean) {
  const [directions, input2] = readInput(day, test).split('\n\n');

  const nodes: Map<string, Node> = new Map();
  input2.split('\n').map(line => {
    const [id, node] = line.split(' = ');
    const [left, right] = node.replace('(', '').replace(')', '').split(', ');
    nodes.set(id, { left, right });
  });
  // console.log(nodes);

  // Part 1
  console.time();
  const res1 = partOne(directions, nodes);
  console.timeEnd();

  // Part 2
  console.time();
  const res2 = partTwo(directions, nodes);
  console.timeEnd();

  return {
    part1: res1,
    part2: lcmArray(res2),
  };
}
