export function printMap(data: number[][], n = 7) {
  data.forEach(row => {
    console.log(row.map(num => String(num).padStart(n, ' ')).join(''));
  });
}
export function printGrid(data: Array<any>) {
  data.forEach(row => {
    console.log(row.join(' '));
  });
}
export function printLines(data: Array<any>) {
  data.forEach(line => {
    console.log(line);
  });
}
