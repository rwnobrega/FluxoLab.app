import React, { CSSProperties, useState } from "react";
import { Handle, Position } from "reactflow";

import { BoxStyle } from "~/core/blockTypes";
import colors from "~/utils/colors";

type Props = {
  id: string;
  position: Position;
  label?: string;
  boxStyle: BoxStyle;
};

export default function ({
  id,
  position,
  label,
  boxStyle,
}: Props): JSX.Element {
  const [mouseHover, setMouseHover] = useState<boolean>(false);
  const { textColor, backgroundColor } = boxStyle;

  const handleStyle: Record<string, CSSProperties> = {
    all: {
      width: "15px",
      height: "15px",
      lineHeight: "15px",
      fontSize: "10px",
      fontWeight: "bold",
      textAlign: "center",
      color: textColor,
      borderColor: colors.darker(backgroundColor),
    },
    "hover-false": {
      backgroundColor: backgroundColor,
    },
    "hover-true": {
      backgroundColor: colors.darker(backgroundColor),
    },
  };

  return (
    <Handle
      id={id}
      type="source"
      position={position}
      style={{
        ...handleStyle.all,
        ...handleStyle[`hover-${mouseHover ? "true" : "false"}`],
      }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      {label}
    </Handle>
  );
}
