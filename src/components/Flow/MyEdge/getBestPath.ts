import _ from "lodash";
import { Node, Position } from "reactflow";

import { NodeData } from "~/store/useStoreFlowchart";

import getPath, { Path } from "./getPath";

const pathTurns = (path: Path): number => {
  return path.length - 1;
};

const manhattanLength = (path: Path): number => {
  let length = 0;
  for (let i = 1; i < path.length; i++) {
    length +=
      Math.abs(path[i][0] - path[i - 1][0]) +
      Math.abs(path[i][1] - path[i - 1][1]);
  }
  return length;
};

export default function (
  sourceNode: Node<NodeData>,
  targetNode: Node<NodeData>,
  sourcePosition: Position,
): [Path, Position] {
  const targetPositions = _.difference(
    _.values(Position),
    _.values(targetNode.data.handlePositions),
  );

  const sourceDimensions = {
    width: sourceNode.width || 0,
    height: sourceNode.height || 0,
  };

  const targetDimensions = {
    width: targetNode.width || 0,
    height: targetNode.height || 0,
  };

  const paths = _.map(targetPositions, (targetPosition) =>
    getPath(
      sourcePosition || Position.Bottom,
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

  return [bestPath, targetPositions[bestPathIndex]];
}
