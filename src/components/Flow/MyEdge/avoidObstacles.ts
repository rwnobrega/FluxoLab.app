import { Path } from "./getPath";

export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

// Nudge interior detour segments of an orthogonal path so they keep a minimum
// clearance from obstacle rectangles (e.g. a wide intermediate node under a
// loop-back edge). A segment is pushed not only when it runs *through* a block
// but also when it merely grazes one, i.e. comes closer than `clearance`.
//
// For each segment we gather every obstacle within `clearance` of it, then move
// the whole segment past the outermost edge of that group in a single step
// (instead of greedily anchoring to the first block hit) so it clears the
// widest block, not just the nearest one. Endpoint stubs (first and last
// segments) are never moved, since that would detach the edge from its handles.
// The scan is repeated a few times so a segment pushed out of one block and
// toward another still gets resolved.
export default function avoidObstacles(
  path: Path,
  obstacles: Rect[],
  clearance: number = 20,
  maxPasses: number = 4,
): Path {
  const p = path.map(([x, y]) => [x, y] as [number, number]);

  for (let pass = 0; pass < maxPasses; pass++) {
    let moved = false;

    // Interior segments only: 1 <= i <= p.length - 3
    for (let i = 1; i < p.length - 2; i++) {
      const [ax, ay] = p[i];
      const [bx, by] = p[i + 1];

      if (ax === bx) {
        // Vertical segment at column x = ax, spanning [y0, y1]
        const y0 = Math.min(ay, by);
        const y1 = Math.max(ay, by);
        const hits = obstacles.filter(
          (o) =>
            o.top < y1 &&
            o.bottom > y0 &&
            o.left - clearance <= ax &&
            ax <= o.right + clearance,
        );
        if (hits.length > 0) {
          const leftMost = Math.min(...hits.map((o) => o.left));
          const rightMost = Math.max(...hits.map((o) => o.right));
          const x =
            ax - leftMost <= rightMost - ax
              ? leftMost - clearance
              : rightMost + clearance;
          if (x !== ax) {
            p[i][0] = x;
            p[i + 1][0] = x;
            moved = true;
          }
        }
      } else if (ay === by) {
        // Horizontal segment at row y = ay, spanning [x0, x1]
        const x0 = Math.min(ax, bx);
        const x1 = Math.max(ax, bx);
        const hits = obstacles.filter(
          (o) =>
            o.left < x1 &&
            o.right > x0 &&
            o.top - clearance <= ay &&
            ay <= o.bottom + clearance,
        );
        if (hits.length > 0) {
          const topMost = Math.min(...hits.map((o) => o.top));
          const bottomMost = Math.max(...hits.map((o) => o.bottom));
          const y =
            ay - topMost <= bottomMost - ay
              ? topMost - clearance
              : bottomMost + clearance;
          if (y !== ay) {
            p[i][1] = y;
            p[i + 1][1] = y;
            moved = true;
          }
        }
      }
    }

    if (!moved) {
      break;
    }
  }

  return p;
}
