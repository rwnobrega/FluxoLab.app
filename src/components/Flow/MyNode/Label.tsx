import React from "react";

import { Block } from "~/core/blocks";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  type: Block["type"];
  prefixLabel?: string;
  value: string;
}

export default function ({ type, prefixLabel, value }: Props): JSX.Element {
  const { getString } = useStoreStrings();
  if (type === "read" || type === "write") {
    console.log(1);
    return (
      <span>
        <i>{prefixLabel}</i>
        {"\u00A0\u00A0"}
        <span className={`font-monospace ${value ? "" : "fst-italic"}`}>
          {value || getString("Block_Empty")}
        </span>
      </span>
    );
  } else if (type === "start" || type === "end") {
    return (
      <span style={{ position: "relative", top: "-2.5px" }}>
        <i>{prefixLabel}</i>
      </span>
    );
  } else {
    return (
      <span className={`font-monospace ${value ? "" : "fst-italic"}`}>
        {value || getString("Block_Empty")}
      </span>
    );
  }
}
