import React from "react";

import { BoxStyle } from "~/core/roles";
import colors from "~/utils/colors";

interface Props {
  boxStyle: BoxStyle;
  boxFilter: string;
  isSelected: boolean;
  isMouseHover: boolean;
  children: JSX.Element;
}

export default function ({
  boxStyle,
  boxFilter,
  isSelected,
  isMouseHover,
  children,
}: Props): JSX.Element {
  function getStripedBackground(color: string): string {
    const darkerColor = colors.darker(color);
    return `repeating-linear-gradient(
      45deg,
      ${color},
      ${color} 10px,
      ${darkerColor} 10px,
      ${darkerColor} 20px
    )`;
  }

  function getBackground(): string {
    const bgColor = boxStyle.backgroundColor;
    const bgDarker = colors.darker(bgColor);
    if (isSelected && isMouseHover) {
      return getStripedBackground(bgDarker);
    } else if (isSelected) {
      return getStripedBackground(bgColor);
    } else if (isMouseHover) {
      return bgDarker;
    } else {
      return bgColor;
    }
  }

  return (
    <div className="text-center small fw-bold" style={{ filter: boxFilter }}>
      <div
        style={{
          lineHeight: "40px",
          color: boxStyle.textColor,
          background: getBackground(),
          borderRadius: boxStyle.borderRadius,
          clipPath: boxStyle.clipPath,
        }}
      >
        {children}
      </div>
    </div>
  );
}
