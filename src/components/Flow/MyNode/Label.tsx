import React from "react";

import { Block } from "~/core/blocks";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  block: Block;
  value: string;
}

export default function ({ block, value }: Props): JSX.Element {
  const { getString } = useStoreStrings();

  switch (block.type) {
    case "read":
    case "write":
      return (
        <span>
          <i>{getString(block.prefixLabel ?? "")}</i>
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
          <i>{getString(block.prefixLabel ?? "")}</i>
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
