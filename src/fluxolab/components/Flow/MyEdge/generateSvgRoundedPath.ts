// From <https://github.com/xyflow/xyflow/blob/main/packages/system/src/utils/edges/smoothstep-edge.ts>

import { XYPosition } from "reactflow";

function distance(a: XYPosition, b: XYPosition): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getBend(
  a: XYPosition,
  b: XYPosition,
  c: XYPosition,
  size: number,
): string {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x, y } = b;

  // no bend
  if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
    return `L${x} ${y}`;
  }

  // first segment is horizontal
  if (a.y === y) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;
    return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
  }

  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}

export default function (
  points: Array<[number, number]>,
  borderRadius: number,
): string {
  const pointsXY: XYPosition[] = points.map(([x, y]) => ({ x, y }));

  const svgPath = pointsXY.reduce<string>((res, p, i) => {
    let segment = "";

    if (i > 0 && i < pointsXY.length - 1) {
      segment = getBend(pointsXY[i - 1], p, pointsXY[i + 1], borderRadius);
    } else {
      segment = `${i === 0 ? "M" : "L"}${p.x} ${p.y}`;
    }

    res += segment;

    return res;
  }, "");

  return svgPath;
}
