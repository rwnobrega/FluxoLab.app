import React from "react";

import palette from "~/utils/palette";

interface Props {
  nodeId: string;
}

/**
 * The number that identifies a block, drawn the same way everywhere it shows
 * up: on the block itself, in the flowchart, and on the "Block" column of the
 * desk check. White on black on purpose -- the role colors already say what
 * kind of block it is, and a number tinted by role would compete with them
 * instead of tying the two views together.
 */
export default function ({ nodeId }: Props): JSX.Element {
  return (
    <span
      className="d-inline-flex justify-content-center align-items-center font-monospace fw-bold"
      style={{
        minWidth: "18px",
        height: "18px",
        padding: "0 4px",
        fontSize: "11px",
        lineHeight: 1,
        color: "white",
        background: palette.gray900,
        borderRadius: "4px",
      }}
    >
      {nodeId}
    </span>
  );
}
