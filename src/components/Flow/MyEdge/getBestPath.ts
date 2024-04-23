import _ from "lodash";
import { Node, Position } from "reactflow";

import blockTypes from "~/core/blockTypes";

import getPath from "./getPath";

const pathTurns = (path: Array<[number, number]>): number => {
  return path.length - 1;
};

const manhattanLength = (path: Array<[number, number]>): number => {
  let length = 0;
  for (let i = 1; i < path.length; i++) {
    length +=
      Math.abs(path[i][0] - path[i - 1][0]) +
      Math.abs(path[i][1] - path[i - 1][1]);
  }
  return length;
};

export default function (
  sourceNode: Node,
  targetNode: Node,
  sourcePosition: Position,
): [Array<[number, number]>, Position] {
  const sourceDimensions = {
    width: sourceNode.width as number,
    height: sourceNode.height as number,
  };
  const targetDimensions = {
    width: targetNode.width as number,
    height: targetNode.height as number,
  };

  const blockType = blockTypes.find((bt) => bt.id === targetNode.type);
  if (!blockType) throw new Error(`Unknown block type: ${targetNode.type}`);

  const takenPositions = [Position.Bottom];
  for (const handle of blockType.handles) {
    if (handle.id !== "in") {
      takenPositions.push(handle.position);
    }
  }

  const positions = _.difference(
    [Position.Top, Position.Right, Position.Bottom, Position.Left],
    takenPositions,
  );

  const paths = _.map(positions, (targetPosition) =>
    getPath(
      sourcePosition,
      targetPosition,
      sourceNode.position,
      targetNode.position,
      sourceDimensions,
      targetDimensions,
    ),
  );

  // Prioritize paths with fewer turns, then shorter paths
  const maxManhattanLength = _.max(_.map(paths, manhattanLength)) ?? 0;
  const multiplier = maxManhattanLength + 1;
  const bestPath =
    _.minBy(
      paths,
      (path) => multiplier * pathTurns(path) + manhattanLength(path),
    ) ?? paths[0];
  const bestPathIndex = _.indexOf(paths, bestPath);

  return [bestPath, positions[bestPathIndex]];
}
