import _ from "lodash";
import { Node, Position, XYPosition } from "reactflow";

import blocks from "~/components/Blocks";

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
  const sourceCenter: XYPosition = {
    x: sourceNode.position.x + sourceDimensions.width / 2,
    y: sourceNode.position.y + sourceDimensions.height / 2,
  };
  const targetDimensions = {
    width: targetNode.width as number,
    height: targetNode.height as number,
  };
  const targetCenter: XYPosition = {
    x: targetNode.position.x + targetDimensions.width / 2,
    y: targetNode.position.y + targetDimensions.height / 2,
  };

  const block = _.find(blocks, { type: targetNode.type });
  if (!block) throw new Error(`Block not found for type ${targetNode.type}`);

  const takenPositions = [Position.Bottom];
  for (const handle of block.handles) {
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
      sourceCenter,
      targetCenter,
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
