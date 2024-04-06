import React from "react";

import { Handle, HandleProps, Position } from "reactflow";

import { BoxStyle } from "components/Blocks";

import { getDarkerColor } from "utils/colors";

import useStoreEphemeral from "stores/useStoreEphemeral";

type Props = HandleProps & {
  boxStyle: BoxStyle;
  label?: string;
};

export default function ({ id, type, boxStyle }: Props): JSX.Element {
  const { textColor, backgroundColor } = boxStyle;

  const { isConnectingEdge } = useStoreEphemeral();

  return (
    <Handle
      id={id}
      type={type}
      position={Position.Top}
      isConnectableStart={false}
      className="react-flow__handle"
      style={{
        background: backgroundColor,
        width: "15px",
        height: "15px",
        borderColor: getDarkerColor(backgroundColor as string),
        color: textColor,
        opacity: isConnectingEdge ? 1 : 0,
      }}
    />
  );
}
