import React, { useState } from "react";
import { Handle, Position } from "reactflow";

import { BoxStyle } from "~/core/roles";
import colors from "~/utils/colors";

interface Props {
  id: string;
  position: Position;
  label?: string;
  boxStyle: BoxStyle;
}

export default function ({
  id,
  position,
  label,
  boxStyle,
}: Props): JSX.Element {
  const [mouseHover, setMouseHover] = useState<boolean>(false);

  return (
    <Handle
      id={id}
      type="source"
      position={position}
      style={{
        display: "flex",
        width: "15px",
        height: "15px",
        lineHeight: "15px",
        fontSize: "10px",
        fontWeight: "bold",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        color: boxStyle.textColor,
        borderColor: colors.darker(boxStyle.backgroundColor),
        backgroundColor: mouseHover
          ? colors.darker(boxStyle.backgroundColor)
          : boxStyle.backgroundColor,
      }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      {label}
    </Handle>
  );
}
