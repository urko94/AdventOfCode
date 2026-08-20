import { readInputLines } from '../utils/input';

class Graph {
  private adj: Map<string, Set<string>>;

  constructor() {
    this.adj = new Map();
  }

  // Add a node if not exists
  addNode(node: string): void {
    if (!this.adj.has(node)) {
      this.adj.set(node, new Set());
    }
  }

  // Add a bidirectional edge
  addEdge(a: string, b: string): void {
    this.addNode(a);
    this.addNode(b);
    this.adj.get(a)!.add(b);
    this.adj.get(b)!.add(a);
  }

  // Get neighbors of a node
  neighbors(node: string): string[] {
    return [...(this.adj.get(node) || [])];
  }

  // Check if edge exists
  hasEdge(a: string, b: string): boolean {
    return this.adj.has(a) && this.adj.get(a)!.has(b);
  }

  // Get all nodes
  nodes(): string[] {
    return [...this.adj.keys()];
  }

  findTriangles(): string[][] {
    const triangles: string[][] = [];
    const nodes = this.nodes();

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          const a = nodes[i];
          const b = nodes[j];
          const c = nodes[k];
          if (this.hasEdge(a, b) && this.hasEdge(b, c) && this.hasEdge(c, a)) {
            triangles.push([a, b, c]);
          }
        }
      }
    }
    return triangles;
  }

  // 🔹 Find triangles where at least one node starts with character
  findTrianglesWith(char: string): string[][] {
    return this.findTriangles().filter(triangle => triangle.some(n => n.startsWith(char)));
  }

  // 🔹 Bron–Kerbosch algorithm to find maximal cliques
  private bronKerbosch(R: Set<string>, P: Set<string>, X: Set<string>, cliques: Set<string>[]): void {
    if (P.size === 0 && X.size === 0) {
      cliques.push(new Set(R));
      return;
    }

    for (const v of [...P]) {
      const neighbors = new Set(this.neighbors(v));
      this.bronKerbosch(
        new Set([...R, v]),
        new Set([...P].filter(n => neighbors.has(n))),
        new Set([...X].filter(n => neighbors.has(n))),
        cliques
      );
      P.delete(v);
      X.add(v);
    }
  }

  // 🔹 Find the maximum clique
  findMaximumClique(): string[] {
    const cliques: Set<string>[] = [];
    this.bronKerbosch(new Set(), new Set(this.nodes()), new Set(), cliques);

    // Return the largest clique (max size)
    let maxClique: string[] = [];
    for (const clique of cliques) {
      if (clique.size > maxClique.length) {
        maxClique = [...clique];
      }
    }
    return maxClique.sort();
  }

  // Debug print
  print(): void {
    for (const [node, neighbors] of this.adj) {
      console.log(node, '->', [...neighbors].join(','));
    }
  }
}

const findLoop = (
  data: Graph,
  path: string[],
  depth = 3,
  d = 0,
  comp?: string,
  results: string[][] = []
): string[][] => {
  if (d > depth) return results;

  if (d > 0 && path[0] === comp) {
    results.push(path);
    return results;
  }

  for (let c of data.neighbors(comp || path[0])) {
    if (c === path[0]) results.push(path);
    else if (!path.includes(c)) results = findLoop(data, [...path, c], depth, d + 1, c, results);
  }
  return results;
};

export function day23(day: number, test: boolean) {
  const lines = readInputLines(day, test);

  // Part 1
  console.time();
  const computers = new Graph();
  lines.map(l => {
    const [c1, c2] = l.split('-');
    computers.addEdge(c1, c2);
  });
  computers.print();

  const triangles = computers.findTriangles();
  const res1 = triangles.filter(triangle => triangle.some(n => n.startsWith('t')));

  console.timeEnd();

  // Part 2
  // const res = findLoop(computers, [computers.nodes()[0]], 15);
  // const res2 = res.map(r => r.length).reduce((acc, curr) => (curr > acc ? curr : acc), 0)
  // console.log(res.map(r => r.length).reduce((acc, curr) => (curr > acc ? curr : acc), 0));
  const res2 = computers.findMaximumClique();
  console.log(res2);

  return {
    part1: res1.length,
    part2: res2.join(','),
  };
}
