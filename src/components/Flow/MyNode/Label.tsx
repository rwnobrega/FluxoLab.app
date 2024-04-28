import React from "react";

import { BlockTypeId, getBlockType } from "~/core/blockTypes";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  blockTypeId: BlockTypeId;
  value: string;
}

export default function ({ blockTypeId, value }: Props): JSX.Element {
  const { getString } = useStoreStrings();

  const { prefixLabel } = getBlockType(blockTypeId);

  switch (blockTypeId) {
    case "read":
    case "write":
      return (
        <span>
          <i>{getString(prefixLabel ?? "")}</i>
          {"\u00A0\u00A0"}
          <span className={`font-monospace ${value ? "" : "fst-italic"}`}>
            {value || getString("Block_Empty")}
          </span>
        </span>
      );
    case "start":
    case "end":
      return (
        <span style={{ position: "relative", top: "-2.5px" }}>
          <i>{getString(prefixLabel ?? "")}</i>
        </span>
      );
    case "assignment":
    case "conditional":
      return (
        <span className={`font-monospace ${value ? "" : "fst-italic"}`}>
          {value || getString("Block_Empty")}
        </span>
      );
  }
}
