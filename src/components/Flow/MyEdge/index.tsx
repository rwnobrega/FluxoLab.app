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
  source,
  target,
  sourcePosition,
  selected,
}: EdgeProps): JSX.Element {
  const [animated, setAnimated] = useState<boolean>(false);
  const { flowchart } = useStoreFlowchart();
  const { machineState: state } = useStoreMachine();

  useEffect(() => {
    if (sourceNode === undefined || targetNode === undefined) {
      setAnimated(false);
    } else if (sourceNode.type === "start" && state.status === "ready") {
      setAnimated(true);
    } else if (!_.includes(["running", "waiting"], state.status)) {
      setAnimated(false);
    } else {
      const nextState = execute(flowchart, state); // Peek the future
      setAnimated(source === state.curNodeId && target === nextState.curNodeId);
    }
  }, [source, target, state.curNodeId, state.status]);

  const sourceNode = _.find(flowchart.nodes, { id: source });
  const targetNode = _.find(flowchart.nodes, { id: target });
  if (sourceNode === undefined || targetNode === undefined) return <></>;

  const [path, targetPosition] = getBestPath(
    sourceNode,
    targetNode,
    sourcePosition,
  );

  if (_.includes(["read", "write"], targetNode.type)) {
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
