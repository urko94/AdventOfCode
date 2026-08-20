import { readInputLines } from '../utils/input';
import { printGrid, printLines } from '../utils/output';
import { isSameLocation, sum } from '../utils/utils';

const pushLocation = (locations: Position[], x: number, y: number) => locations.push([x, y]);
const hasLocation = (locations: Position[], a: Position) => locations.some(loc => isSameLocation(loc, a));
const isNeighbor = (location: Position, locations: Position[]) => locations.some(loc => isSameLocation(loc, location));
const addLocation = (locations: Position[], x: number, y: number) => {
  if (!hasLocation(locations, [x, y])) {
    locations.push([x, y]);
  }
};

const numOfNeighbors = (location: Position, locations: Position[]) => {
  const [x, y] = location;
  const neighbors: Position[] = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  return neighbors.filter(neighbor => locations.some(loc => isSameLocation(loc, neighbor))).length;
};

const cornersMap = (location: Position, locations: Position[], corners: Position[]) => {
  const [x, y] = location;
  const n = numOfNeighbors(location, locations);

  switch (n) {
    case 0:
      addLocation(corners, x, y);
      addLocation(corners, x + 1, y);
      addLocation(corners, x, y + 1);
      addLocation(corners, x + 1, y + 1);
      return corners;
    case 1:
      if (isNeighbor([x - 1, y], locations)) {
        pushLocation(corners, x + 1, y);
        pushLocation(corners, x + 1, y + 1);
      } else if (isNeighbor([x + 1, y], locations)) {
        pushLocation(corners, x, y);
        pushLocation(corners, x, y + 1);
      } else if (isNeighbor([x, y - 1], locations)) {
        pushLocation(corners, x, y + 1);
        pushLocation(corners, x + 1, y + 1);
      } else {
        pushLocation(corners, x, y);
        pushLocation(corners, x + 1, y);
      }
      return corners;
    case 2:
      if (isNeighbor([x - 1, y], locations) && isNeighbor([x, y + 1], locations)) {
        if (!isNeighbor([x - 1, y + 1], locations)) addLocation(corners, x, y + 1);
        pushLocation(corners, x + 1, y);
      } else if (isNeighbor([x, y - 1], locations) && isNeighbor([x + 1, y], locations)) {
        if (!isNeighbor([x + 1, y - 1], locations)) addLocation(corners, x + 1, y);
        pushLocation(corners, x, y + 1);
      } else if (isNeighbor([x + 1, y], locations) && isNeighbor([x, y + 1], locations)) {
        if (!isNeighbor([x + 1, y + 1], locations)) addLocation(corners, x + 1, y + 1);
        pushLocation(corners, x, y);
      } else if (isNeighbor([x, y - 1], locations) && isNeighbor([x - 1, y], locations)) {
        if (!isNeighbor([x - 1, y - 1], locations)) addLocation(corners, x, y);
        pushLocation(corners, x + 1, y + 1);
      }
      return corners;

    case 3:
      if (!isNeighbor([x - 1, y], locations)) {
        if (!isNeighbor([x + 1, y - 1], locations)) addLocation(corners, x + 1, y);
        if (!isNeighbor([x + 1, y + 1], locations)) addLocation(corners, x + 1, y + 1);
      } else if (!isNeighbor([x + 1, y], locations)) {
        if (!isNeighbor([x - 1, y - 1], locations)) addLocation(corners, x, y);
        if (!isNeighbor([x - 1, y + 1], locations)) addLocation(corners, x, y + 1);
      } else if (!isNeighbor([x, y - 1], locations)) {
        if (!isNeighbor([x - 1, y + 1], locations)) addLocation(corners, x, y + 1);
        if (!isNeighbor([x + 1, y + 1], locations)) addLocation(corners, x + 1, y + 1);
      } else {
        if (!isNeighbor([x - 1, y - 1], locations)) addLocation(corners, x, y);
        if (!isNeighbor([x + 1, y - 1], locations)) addLocation(corners, x + 1, y);
      }
      return corners;
    default:
      if (!isNeighbor([x - 1, y - 1], locations)) addLocation(corners, x, y);
      if (!isNeighbor([x - 1, y + 1], locations)) addLocation(corners, x, y + 1);
      if (!isNeighbor([x + 1, y - 1], locations)) addLocation(corners, x + 1, y);
      if (!isNeighbor([x + 1, y + 1], locations)) addLocation(corners, x + 1, y + 1);
      return corners;
  }
};

const neighborLocations = (location: Position, locations: Position[][]) => {
  const neighbors: number[] = [];
  for (let i = 0; i < locations.length; i++) {
    if (numOfNeighbors(location, locations[i]) > 0) {
      neighbors.push(i);
    }
  }
  return neighbors;
};

const groupCornersByRectangles = (corners: Position[]) => {
  const remainingCorners = [...corners];
  const grouped: Position[][] = [];

  let addedCorner = false;
  while (remainingCorners.length > 0) {
    if (!addedCorner) {
      grouped.push(remainingCorners.splice(0, 1));
    }
    addedCorner = false;
    remainingCorners.forEach((corner, index) => {
      const [x, y] = corner;
      const group = grouped.find(g => g.some(([gx, gy]) => gx === x || gy === y));
      if (group) {
        group.push(remainingCorners.splice(index, 1)[0]);
        addedCorner = true;
      }
    });
  }
  return grouped;
};

export function day12() {
  const grid = readInputLines(12).map(line => line.split(''));

  // Part 1
  const areas: Record<string, Position[][]> = {};
  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!areas[cell]) areas[cell] = [];

      const nLocations = neighborLocations([r, c], areas[cell]);
      if (areas[cell].length === 0 || nLocations.length === 0) {
        areas[cell].push([[r, c]]);
      } else if (nLocations.length === 1) {
        areas[cell][nLocations[0]].push([r, c]);
      } else {
        areas[cell][nLocations[0]].push([r, c]);
        for (let i = 1; i < nLocations.length; i++) {
          areas[cell][nLocations[i]].forEach(location => {
            areas[cell][nLocations[0]].push(location);
          });
          areas[cell].splice(nLocations[i], 1);
        }
      }
    });
  });

  const res1 = Object.values(areas).map(area =>
    area.map(
      locations =>
        locations.reduce((acc, location) => acc + (4 - numOfNeighbors(location, locations)), 0) * locations.length
    )
  );

  //Part 2
  Object.entries(areas).forEach(([cell, areas]) => {
    // console.log(cell);
    // printGrid(areas);
  });
  const res2 = Object.entries(areas).map(([cell, areas]) =>
    areas.map(locations => {
      const corners = locations.reduce((acc, location) => {
        return cornersMap(location, locations, acc);
      }, [] as Position[]);

      const groupedCorners = groupCornersByRectangles(corners);

      return groupedCorners.reduce((acc, group) => {
        // console.log('group', group, acc, group.length * locations.length);
        return acc + group.length * locations.length;
      }, 0);
    })
  );
  // console.log(res2);

  return {
    part1: sum(res1.flat()),
    part2: sum(res2.flat()),
  };
}
