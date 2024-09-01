import React from "react";
import { Handle, Position } from "reactflow";

interface Props {
  id: string;
}

export default function ({ id }: Props): JSX.Element {
  return (
    <Handle
      id={id}
      type="target"
      position={Position.Top}
      isConnectableStart={false}
      isConnectable={false} // Connections are created manually
      style={{ backgroundColor: "transparent", borderColor: "transparent" }}
    />
  );
}
