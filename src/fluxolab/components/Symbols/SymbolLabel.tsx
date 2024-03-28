import React from "react";

interface Props {
  prefixLabel?: string;
  value?: string;
}

export default function ({ prefixLabel, value }: Props): JSX.Element {
  if (prefixLabel && value) {
    return (
      <span>
        <i>{prefixLabel}</i>
        {"\u00A0\u00A0"}
        <span className="font-monospace">{value}</span>
      </span>
    );
  } else if (prefixLabel) {
    return (
      <span style={{ position: "relative", top: "-2.5px" }}>
        <i>{prefixLabel}</i>
      </span>
    );
  } else {
    return <span className="font-monospace">{value}</span>;
  }
}
