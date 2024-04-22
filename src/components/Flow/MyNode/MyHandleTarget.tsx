import React from "react";
import { Handle, HandleProps, Position } from "reactflow";

import { BoxStyle } from "~/core/blocks";

type Props = HandleProps & {
  boxStyle: BoxStyle;
  label?: string;
};

export default function ({ id, type }: Props): JSX.Element {
  return (
    <Handle
      id={id}
      type={type}
      position={Position.Top}
      isConnectableStart={false}
      className="react-flow__handle"
      style={{
        width: "80px",
        height: "40px",
        top: "0px",
        borderRadius: "0",
        backgroundColor: "transparent",
        borderColor: "transparent",
      }}
    />
  );
}
