import React from "react";

import { Role } from "~/core/roles";
import { NodeData } from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  data: NodeData;
}

export default function ({ data }: Props): JSX.Element {
  const { getString } = useStoreStrings();

  const { role, payload } = data;

  const label = getString(`BlockLabel_${role}`);

  switch (role) {
    case Role.Read:
    case Role.Write:
      return (
        <span>
          <i>{label}</i>
          {"\u00A0\u00A0"}
          <span className={`font-monospace ${payload ? "" : "fst-italic"}`}>
            {payload || getString("Block_Empty")}
          </span>
        </span>
      );
    case Role.Start:
    case Role.End:
      return (
        <span style={{ position: "relative", top: "-2.5px" }}>
          <i>{label}</i>
        </span>
      );
    case Role.Assign:
    case Role.Conditional:
      return (
        <span className={`font-monospace ${payload ? "" : "fst-italic"}`}>
          {payload || getString("Block_Empty")}
        </span>
      );
  }
}
