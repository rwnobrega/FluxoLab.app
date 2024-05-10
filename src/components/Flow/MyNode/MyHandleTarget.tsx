import React from "react";
import { Handle, Position } from "reactflow";

type Props = {
  id: string;
};

export default function ({ id }: Props): JSX.Element {
  return (
    <Handle
      id={id}
      type={"target"}
      position={Position.Top}
      isConnectableStart={false}
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
