// custom implementation of google.maps.Point
export class Point {
  constructor(public x: number, public y: number) {}

  equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}
