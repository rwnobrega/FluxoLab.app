import _ from "lodash";
import React, { useEffect, useState } from "react";
import { EdgeProps } from "reactflow";

import execute from "~/core/machine/execute";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";

import SvgEdge from "./SvgEdge";
import generateSvgRoundedPath from "./generateSvgRoundedPath";
import getBestPath from "./getBestPath";

export default function ({
  source: sourceId,
  target: targetId,
  sourceHandleId,
  sourcePosition,
  selected,
}: EdgeProps): JSX.Element {
  const [animated, setAnimated] = useState<boolean>(false);
  const { flowchart } = useStoreFlowchart();
  const { machineState: state } = useStoreMachine();

  useEffect(() => {
    if (source === undefined || target === undefined) {
      setAnimated(false);
    } else if (state.status === "ready" && source.type === "start") {
      setAnimated(true);
    } else if (state.status === "waiting" && source.type === "read") {
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
  if (source === undefined || target === undefined) return <></>;

  const [path, targetPosition] = getBestPath(source, target, sourcePosition);

  if (_.includes(["read", "write"], target.type)) {
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
