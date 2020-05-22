// https://stackoverflow.com/a/1684207/1188074
export function roundToWhole(value: number, nearest: number) {
  return Math.round(value / nearest) * nearest;
}
