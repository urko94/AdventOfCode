import { Direction, directions, Grid, MapPosition } from '../types';
import { isSamePosition } from './utils';

export interface Node {
  id: string;
  pos: MapPosition;
  edges: { to: string; dist: number }[];
}

export enum Tile {
  PATH = '.', // walkable
  FOREST = '#', // blocked
  SLOPE_UP = '^',
  SLOPE_DOWN = 'v',
  SLOPE_LEFT = '<',
  SLOPE_RIGHT = '>',
  START = 'S',
  END = 'E',
}
export const SlopeDirections: Record<Tile, Direction> = {
  [Tile.SLOPE_UP]: Direction.UP,
  [Tile.SLOPE_DOWN]: Direction.DOWN,
  [Tile.SLOPE_LEFT]: Direction.LEFT,
  [Tile.SLOPE_RIGHT]: Direction.RIGHT,
  [Tile.PATH]: Direction.DOWN, // not used, but keeps TypeScript happy
  [Tile.FOREST]: Direction.DOWN,
  [Tile.START]: Direction.DOWN,
  [Tile.END]: Direction.DOWN,
};

export const getKey = (y: number, x: number) => `${y},${x}`;
export const isSlope = (tile: Tile): boolean =>
  tile === Tile.SLOPE_UP || tile === Tile.SLOPE_DOWN || tile === Tile.SLOPE_LEFT || tile === Tile.SLOPE_RIGHT;

export const inBounds = (grid: Grid, { x, y }: MapPosition): boolean => {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
};

export const isOppositeDirection = (a: Direction, b: Direction): boolean => {
  return (
    (a === Direction.UP && b === Direction.DOWN) ||
    (a === Direction.DOWN && b === Direction.UP) ||
    (a === Direction.LEFT && b === Direction.RIGHT) ||
    (a === Direction.RIGHT && b === Direction.LEFT)
  );
};

const isOpenTile = (grid: string[][], p: MapPosition) => {
  const row = grid[p.y];
  if (!row) return false;
  const ch = row[p.x];
  return ch !== undefined && ch !== Tile.FOREST;
};

function buildGraph(grid: string[][]) {
  const H = grid.length;
  const W = grid[0].length;
  const nodes: Map<string, Node> = new Map();

  // Helper to count open neighbors
  const countOpenNeighbors = (y: number, x: number) => {
    let c = 0;
    for (const { dy, dx } of Object.values(directions)) {
      const ny = y + dy,
        nx = x + dx;
      if (ny >= 0 && ny < H && nx >= 0 && nx < W && grid[ny][nx] !== Tile.FOREST) c++;
    }
    return c;
  };

  // 1) Find candidate nodes: positions that are S/E or have != 2 open neighbors (junctions and dead-ends)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ch = grid[y][x];
      if (ch === Tile.FOREST) continue;
      const isSpecial = ch === Tile.START || ch === Tile.END;
      const openNeighbors = countOpenNeighbors(y, x);
      if (isSpecial || openNeighbors !== 2) {
        const id = getKey(y, x);
        nodes.set(id, { id, pos: { y, x }, edges: [] });
      }
    }
  }

  // 1b) Ensure S/E exist as nodes even if they were missed (safety)
  const findTilePosition = (tile: Tile): MapPosition | null => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (grid[y][x] === tile) return { y, x };
    return null;
  };
  for (const special of [Tile.START, Tile.END]) {
    const p = findTilePosition(special);
    if (p) {
      const id = getKey(p.y, p.x);
      if (!nodes.has(id)) nodes.set(id, { id, pos: p, edges: [] });
    }
  }

  // 2) From each node, walk straight in each direction until you hit another node (or wall). Record edge and distance.
  const inBounds = (y: number, x: number) => y >= 0 && y < H && x >= 0 && x < W;

  for (const node of nodes.values()) {
    const { y: sy, x: sx } = node.pos;
    const startKey = getKey(sy, sx);

    // BFS from the node into all open tiles to find every reachable node and shortest distance to it
    const visited: boolean[][] = Array.from({ length: H }, () => Array(W).fill(false));
    // don't revisit the start cell
    visited[sy][sx] = true;

    const queue: { y: number; x: number; dist: number }[] = [];

    // seed with all open neighbors (all directions)
    for (const { dy, dx } of Object.values(directions)) {
      const ny = sy + dy;
      const nx = sx + dx;
      if (!inBounds(ny, nx) || grid[ny][nx] === Tile.FOREST) continue;
      visited[ny][nx] = true;
      queue.push({ y: ny, x: nx, dist: 1 });
    }

    while (queue.length > 0) {
      const { y, x, dist } = queue.shift()!;
      const key = getKey(y, x);

      // If we reached another node (not the start), record an edge and do NOT expand past it
      if (nodes.has(key) && key !== startKey) {
        // avoid duplicate edge entries (safety)
        if (!node.edges.some(e => e.to === key)) node.edges.push({ to: key, dist });
        continue;
      }

      // otherwise expand to all 4 neighbors
      for (const { dy, dx } of Object.values(directions)) {
        const ny = y + dy;
        const nx = x + dx;
        if (!inBounds(ny, nx) || visited[ny][nx] || grid[ny][nx] === Tile.FOREST) continue;
        visited[ny][nx] = true;
        queue.push({ y: ny, x: nx, dist: dist + 1 });
      }
    }
  }

  return { nodes, H, W };
}

/**
 * If start/end are not nodes (in the nodes map), find the first node reachable from them by walking along corridor.
 * Returns node id or null.
 */
function findClosestNodeFrom(grid: string[][], nodes: Map<string, Node>, startPos: MapPosition): string | null {
  const H = grid.length,
    W = grid[0].length;
  const inBounds = (y: number, x: number) => y >= 0 && y < H && x >= 0 && x < W;
  // If start itself is node
  const sKey = getKey(startPos.y, startPos.x);
  if (nodes.has(sKey)) return sKey;
  // Otherwise walk in each direction until node or wall
  for (const { dy, dx } of Object.values(directions)) {
    let y = startPos.y + dy,
      x = startPos.x + dx;
    let steps = 1;
    while (inBounds(y, x) && grid[y][x] !== Tile.FOREST) {
      const key = getKey(y, x);
      if (nodes.has(key)) return key;
      y += dy;
      x += dx;
      steps++;
    }
  }
  return null;
}

// Non-recursive DFS to find longest simple path between startId and endId
function longestPath(nodes: Map<string, Node>, startId: string, endId: string): number {
  if (!nodes.has(startId) || !nodes.has(endId)) return 0;
  let maxLen = 0;
  // Stack entries: nodeId, accumulated distance, visited Set
  const stack: { id: string; dist: number; visited: Set<string> }[] = [];
  stack.push({ id: startId, dist: 0, visited: new Set([startId]) });

  while (stack.length > 0) {
    const { id, dist, visited } = stack.pop()!;
    if (id === endId) {
      if (dist > maxLen) maxLen = dist;
      continue;
    }
    const node = nodes.get(id)!;
    for (const edge of node.edges) {
      if (visited.has(edge.to)) continue;
      // push new state
      const newVisited = new Set(visited);
      newVisited.add(edge.to);
      stack.push({ id: edge.to, dist: dist + edge.dist, visited: newVisited });
    }
  }
  return maxLen;
}

/** Main entry: pass grid as string[][], returns longest simple path length in steps */
export function solveLongestPath(grid: string[][], startPos: MapPosition, endPos: MapPosition): number {
  const { nodes } = buildGraph(grid);
  console.log(`Graph built with ${nodes.size} nodes.`);
  nodes.forEach(n => {
    console.log(
      `Node ${n.id} at (${n.pos.y},${n.pos.x}) with edges: ${n.edges.map(e => `${e.to}(${e.dist})`).join(', ')}`
    );
  });

  // get node ids for start and end (or the closest nodes along corridors)
  const startId = findClosestNodeFrom(grid, nodes, startPos);
  const endId = findClosestNodeFrom(grid, nodes, endPos);
  console.log(`Mapped start to node ${startId}, end to node ${endId}.`);

  if (!startId || !endId) {
    console.warn('Could not map start or end to graph nodes.');
    return 0;
  }

  return longestPath(nodes, startId, endId);
}
