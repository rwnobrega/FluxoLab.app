import _ from "lodash";

import React, { useCallback, useEffect, useState } from "react";

import { useStore, EdgeProps } from "reactflow";

import generateSvgRoundedPath from "./generateSvgRoundedPath";
import getBestPath from "./getBestPath";
import SvgEdge from "./SvgEdge";

import useStoreMachine from "stores/useStoreMachine";
import useStoreMachineState from "stores/useStoreMachineState";

export default function ({
  source,
  target,
  sourcePosition,
  selected,
}: EdgeProps): JSX.Element {
  const [animated, setAnimated] = useState<boolean>(false);
  const { machine, compileErrors } = useStoreMachine();
  const { getState } = useStoreMachineState();
  const state = getState();

  useEffect(() => {
    const sourceNode = _.find(machine.flowchart, { id: source });
    if (sourceNode === undefined || compileErrors.length > 0) {
      setAnimated(false);
      return;
    }
    if (sourceNode.id === machine.startSymbolId) {
      setAnimated(state.timeSlot === -1);
      return;
    }
    // Peek the future --- TODO: What if `rand` or `rand_int` is used?
    const stateClone = _.cloneDeep(state);
    const sourceSymbolId = stateClone.curSymbolId;
    sourceNode.work(machine, stateClone);
    const targetSymbolId = stateClone.curSymbolId;
    setAnimated(source === sourceSymbolId && target === targetSymbolId);
  }, [state, machine]);

  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source]),
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target]),
  );

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
