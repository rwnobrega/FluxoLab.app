import _ from "lodash";
import React, { useEffect, useState } from "react";
import { EdgeProps } from "reactflow";

import execute from "~/core/execute";
import { Role } from "~/core/roles";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";

import SvgEdge from "./SvgEdge";
import generateSvgRoundedPath from "./generateSvgRoundedPath";
import getBestPath from "./getBestPath";

export default function ({
  source: sourceId,
  target: targetId,
  sourceHandleId,
  selected,
}: EdgeProps): JSX.Element {
  const [animated, setAnimated] = useState<boolean>(false);
  const { flowchart } = useStoreFlowchart();
  const { machineState: state } = useStoreMachine();

  useEffect(() => {
    if (source === undefined || target === undefined) {
      setAnimated(false);
    } else if (state.status === "ready" && source.data.role === Role.Start) {
      setAnimated(true);
    } else if (state.status === "waiting" && source.data.role === Role.Read) {
      setAnimated(state.curNodeId === sourceId);
    } else if (state.status === "running") {
      const nextState = execute(flowchart, state); // Peek the future
      setAnimated(
        state.curNodeId === sourceId &&
          nextState.curNodeId === targetId &&
          nextState.outPort === sourceHandleId,
      );
    } else {
      setAnimated(false);
    }
  }, [sourceId, targetId, sourceHandleId, state.curNodeId, state.status]);

  const source = _.find(flowchart.nodes, { id: sourceId });
  const target = _.find(flowchart.nodes, { id: targetId });
  if (
    source === undefined ||
    target === undefined ||
    sourceHandleId === null ||
    sourceHandleId === undefined
  )
    return <></>;

  const sourcePosition = source.data.handlePositions[sourceHandleId];

  const [path, targetPosition] = getBestPath(source, target, sourcePosition);

  if (_.includes([Role.Read, Role.Write], target.data.role)) {
    if (targetPosition === "left") {
      path[path.length - 1][0] += 10;
    } else if (targetPosition === "right") {
      path[path.length - 1][0] -= 10;
    }
  }

  const svgPathString = generateSvgRoundedPath(path, 10);
  const [targetX, targetY] = path[path.length - 1];

  return (
    <SvgEdge
      svgPathString={svgPathString}
      selected={selected ?? false}
      animated={animated}
      targetX={targetX}
      targetY={targetY}
      targetPosition={targetPosition}
    />
  );
}
