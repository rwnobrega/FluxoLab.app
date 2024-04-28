import _ from "lodash";
import React, { useEffect } from "react";

import compile from "~/core/machine/compiler";
import useStoreFlow from "~/store/useStoreFlow";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreMachineState from "~/store/useStoreMachineState";

export default function (): JSX.Element {
  const { nodes, edges } = useStoreFlow();
  const { machine, setFlowchart, setCompileErrors } = useStoreMachine();
  const { reset } = useStoreMachineState();

  const nodesDep = JSON.stringify(
    _.map(nodes, (node) => _.pick(node, ["id", "type", "data"])),
  );
  const edgesDep = JSON.stringify(
    _.map(edges, (edge) =>
      _.pick(edge, ["id", "source", "sourceHandle", "target", "targetHandle"]),
    ),
  );

  useEffect(() => {
    const { flowchart, errors } = compile({
      nodes,
      edges,
      variables: machine.variables,
    });
    setFlowchart(flowchart);
    setCompileErrors(errors);
  }, [nodesDep, edgesDep, machine.variables]);

  useEffect(() => {
    reset(machine);
  }, [machine.flowchart]);

  return <></>;
}
