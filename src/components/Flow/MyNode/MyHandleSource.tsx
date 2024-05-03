import React, { useState } from "react";
import { Handle, HandleProps } from "reactflow";

import { BoxStyle } from "~/core/blockTypes";
import colors from "~/utils/colors";

type Props = HandleProps & {
  boxStyle: BoxStyle;
  label?: string;
};

export default function ({
  id,
  type,
  position,
  label,
  boxStyle,
}: Props): JSX.Element {
  const [mouseHover, setMouseHover] = useState<boolean>(false);
  const { textColor, backgroundColor } = boxStyle;

  const handleStyle = {
    all: {
      width: "15px",
      height: "15px",
      lineHeight: "15px",
      fontSize: "10px",
      fontWeight: "bold",
      textAlign: "center" as "center",
      color: textColor,
      borderColor: colors.darker(backgroundColor as string),
    },
    "hover-false": {
      backgroundColor: backgroundColor,
    },
    "hover-true": {
      backgroundColor: colors.darker(backgroundColor as string),
    },
  };

  return (
    <Handle
      id={id}
      type={type}
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
