import React from "react";

import { BlockType } from "~/core/blockTypes";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  blockType: BlockType;
  value: string;
}

export default function ({ blockType, value }: Props): JSX.Element {
  const { getString } = useStoreStrings();

  switch (blockType.id) {
    case "read":
    case "write":
      return (
        <span>
          <i>{getString(blockType.prefixLabel ?? "")}</i>
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
          <i>{getString(blockType.prefixLabel ?? "")}</i>
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
