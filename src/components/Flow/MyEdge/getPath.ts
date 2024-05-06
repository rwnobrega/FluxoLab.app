import _ from "lodash";
import { Dimensions, Position, XYPosition } from "reactflow";

import doRectanglesIntersect from "./doRectanglesIntersect";

export type Path = Array<[number, number]>;

export default function getPath(
  pos0: Position,
  pos1: Position,
  center0: XYPosition,
  center1: XYPosition,
  dim0: Dimensions,
  dim1: Dimensions,
  gridSize: number = 20,
): Path {
  const right0 = center0.x + dim0.width / 2;
  const left0 = center0.x - dim0.width / 2;
  const top0 = center0.y - dim0.height / 2;
  const bottom0 = center0.y + dim0.height / 2;
  const right1 = center1.x + dim1.width / 2;
  const left1 = center1.x - dim1.width / 2;
  const top1 = center1.y - dim1.height / 2;
  const bottom1 = center1.y + dim1.height / 2;

  const [x0, y0] = {
    [Position.Top]: [center0.x, top0],
    [Position.Bottom]: [center0.x, bottom0],
    [Position.Left]: [left0, center0.y],
    [Position.Right]: [right0, center0.y],
  }[pos0];

  const [x1, y1] = {
    [Position.Top]: [center1.x, top1],
    [Position.Bottom]: [center1.x, bottom1],
    [Position.Left]: [left1, center1.y],
    [Position.Right]: [right1, center1.y],
  }[pos1];

  let path: Path = [];

  if (doRectanglesIntersect(center0, dim0, center1, dim1)) {
    return [
      [x0, y0],
      [x0, y1],
      [x1, y1],
    ];
  }

  //  1 |   2   | 3
  // ---+-------+---
  //  4 | rect0 | 5
  // ---+-------+---
  //  6 |   7   | 8

  switch (pos0) {
    case Position.Bottom: {
      switch (pos1) {
        case Position.Top: {
          if (bottom0 < top1) {
            // Cases 6, 7, 8
            const yp = (y0 + y1) / 2;
            path = [
              [x0, y0],
              [x0, yp],
              [x1, yp],
              [x1, y1],
            ];
            break;
          }
          let xp: number;
          if (left0 > right1) {
            // Cases 1, 4
            xp = (left0 + right1) / 2;
          } else if (right0 < left1) {
            // Cases 3, 5
            xp = (right0 + left1) / 2;
          } else if (x0 >= x1) {
            // Case 2a
            xp = Math.min(left0, left1) - gridSize;
          } else {
            // Case 2b
            xp = Math.max(right0, right1) + gridSize;
          }
          path = [
            [x0, y0],
            [x0, y0 + gridSize],
            [xp, y0 + gridSize],
            [xp, y1 - gridSize],
            [x1, y1 - gridSize],
            [x1, y1],
          ];
          break;
        }
        case Position.Left: {
          if (bottom0 <= top1 && x0 < left1) {
            // Case 7b, 8
            path = [
              [x0, y0],
              [x0, y1],
              [x1, y1],
            ];
            break;
          }
          let xp, yp: number;
          if (right0 < left1) {
            // Cases 3, 5
            xp = (right0 + left1) / 2;
            yp = y0 + gridSize;
          } else if (top0 > bottom1) {
            // Cases 1, 2
            xp = Math.min(left0, left1) - gridSize;
            yp = Math.max(bottom0, bottom1) + gridSize;
          } else if (bottom0 < top1) {
            // Cases 6, 7a
            xp = left1 - gridSize;
            yp = (bottom0 + top1) / 2;
          } else {
            // Case 4
            xp = Math.min(left0, left1) - gridSize;
            yp = Math.max(bottom0, bottom1) + gridSize;
          }
          path = [
            [x0, y0],
            [x0, yp],
            [xp, yp],
            [xp, y1],
            [x1, y1],
          ];
          break;
        }
        case Position.Right: {
          // Use symmetry
          const newCenter0 = { x: -center0.x, y: center0.y };
          const newCenter1 = { x: -center1.x, y: center1.y };
          return _.map(
            getPath(
              Position.Bottom,
              Position.Left,
              newCenter0,
              newCenter1,
              dim0,
              dim1,
            ),
            ([x, y]) => [-x, y],
          );
        }
      }
      break;
    }

    case Position.Right: {
      switch (pos1) {
        case Position.Top: {
          // Use symmetry
          const newCenter0 = { x: center0.x, y: -center0.y };
          const newCenter1 = { x: center1.x, y: -center1.y };
          return _.reverse(
            _.map(
              getPath(
                Position.Bottom,
                Position.Right,
                newCenter1,
                newCenter0,
                dim1,
                dim0,
              ),
              ([x, y]) => [x, -y],
            ),
          );
        }
        case Position.Left: {
          if (right0 < left1) {
            // Cases 3, 5, 8
            const xp = (x0 + x1) / 2;
            path = [
              [x0, y0],
              [xp, y0],
              [xp, y1],
              [x1, y1],
            ];
            break;
          }
          let xp, yp: number;
          if (top0 > bottom1 || bottom0 < top1) {
            // Cases 1, 2, 6, 7
            xp = x1 - gridSize;
            yp = (y0 + y1) / 2;
          } else if (y0 > center1.y) {
            // Case 4a
            xp = left1 - gridSize;
            yp = top1 - gridSize;
          } else {
            // Case 4b
            xp = left1 - gridSize;
            yp = bottom1 + gridSize;
          }
          path = [
            [x0, y0],
            [x0 + gridSize, y0],
            [x0 + gridSize, yp],
            [xp, yp],
            [xp, y1],
            [x1, y1],
          ];
          break;
        }
        case Position.Right: {
          if (bottom0 <= top1 || top0 >= bottom1) {
            // Cases 1, 2, 3, 6, 7, 8
            const xp = Math.max(right0, right1) + gridSize;
            path = [
              [x0, y0],
              [xp, y0],
              [xp, y1],
              [x1, y1],
            ];
          } else if (right0 < left1) {
            // Case 5
            const xp = (right0 + left1) / 2;
            const yp = bottom1 + gridSize;
            path = [
              [x0, y0],
              [xp, y0],
              [xp, yp],
              [x1 + gridSize, yp],
              [x1 + gridSize, y1],
              [x1, y1],
            ];
          } else {
            // Case 4
            const xp = (left0 + right1) / 2;
            const yp = bottom0 + gridSize;
            path = [
              [x0, y0],
              [x0 + gridSize, y0],
              [x0 + gridSize, yp],
              [xp, yp],
              [xp, y1],
              [x1, y1],
            ];
          }
          break;
        }
      }
      break;
    }

    case Position.Left: {
      // Use symmetry
      const newCenter0 = { x: -center0.x, y: center0.y };
      const newCenter1 = { x: -center1.x, y: center1.y };
      const newPos1 = {
        [Position.Top]: Position.Top,
        [Position.Bottom]: Position.Bottom,
        [Position.Left]: Position.Right,
        [Position.Right]: Position.Left,
      }[pos1];
      return _.map(
        getPath(Position.Right, newPos1, newCenter0, newCenter1, dim0, dim1),
        ([x, y]) => [-x, y],
      );
      break;
    }
  }
  return removeRedundantPoints(path);
}

function removeRedundantPoints(path: Path): Path {
  const newPath = [path[0]];
  for (let i = 1; i < path.length - 1; i++) {
    if (path[i][0] === path[i - 1][0] && path[i][0] === path[i + 1][0]) {
      continue;
    }
    if (path[i][1] === path[i - 1][1] && path[i][1] === path[i + 1][1]) {
      continue;
    }
    newPath.push(path[i]);
  }
  newPath.push(path[path.length - 1]);
  return newPath;
}
