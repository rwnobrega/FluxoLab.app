import _ from "lodash";
import React, { useEffect } from "react";

import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";

export default function (): JSX.Element {
  const { flowchart } = useStoreFlowchart();
  const { resetMachine } = useStoreMachine();

  const nodesDep = JSON.stringify(
    _.map(flowchart.nodes, (node) => _.pick(node, ["id", "data"])),
  );
  const edgesDep = JSON.stringify(
    _.map(flowchart.edges, (edge) =>
      _.pick(edge, ["source", "sourceHandle", "target"]),
    ),
  );

  useEffect(() => {
    resetMachine(flowchart);
  }, [nodesDep, edgesDep, flowchart.variables]);

  return <></>;
}
