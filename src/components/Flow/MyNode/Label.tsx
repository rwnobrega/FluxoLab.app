import React from "react";
import { Node } from "reactflow";

import { BlockTypeId } from "~/core/blockTypes";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  node: Node;
}

export default function ({ node }: Props): JSX.Element {
  const { getString } = useStoreStrings();

  const label = getString(`BlockLabel_${node.type}`);

  switch (node.type as BlockTypeId) {
    case "read":
    case "write":
      return (
        <span>
          <i>{label}</i>
          {"\u00A0\u00A0"}
          <span className={`font-monospace ${node.data ? "" : "fst-italic"}`}>
            {node.data || getString("Block_Empty")}
          </span>
        </span>
      );
    case "start":
    case "end":
      return (
        <span style={{ position: "relative", top: "-2.5px" }}>
          <i>{label}</i>
        </span>
      );
    case "assignment":
    case "conditional":
      return (
        <span className={`font-monospace ${node.data ? "" : "fst-italic"}`}>
          {node.data || getString("Block_Empty")}
        </span>
      );
  }
}
