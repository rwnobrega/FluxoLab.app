import _ from "lodash";
import { Dimensions, Node, Position } from "reactflow";

import { BlockTypeId, getBlockType } from "~/core/blockTypes";
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
  const { handles } = getBlockType(targetNode.type as BlockTypeId);

  const targetPositions = [
    Position.Top,
    Position.Right,
    Position.Bottom,
    Position.Left,
  ];
  for (const handle of handles) {
    if (handle.id !== "in") {
      _.remove(targetPositions, (pos) => pos === handle.position);
    }
  }

  const paths = _.map(targetPositions, (targetPosition) =>
    getPath(
      sourcePosition,
      targetPosition,
      sourceNode.position,
      targetNode.position,
      sourceNode as Dimensions,
      targetNode as Dimensions,
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
