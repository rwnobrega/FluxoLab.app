import React, { useState } from "react";

import { BoxStyle } from "~/components/Blocks";
import {
  getBrighterColor,
  getDarkerColor,
  getStripedBackground,
} from "~/utils/colors";

interface Props {
  boxStyle: BoxStyle;
  boxFilter?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  children: JSX.Element;
}

export default function ({
  boxStyle,
  boxFilter,
  isSelected = false,
  isDisabled = false,
  children,
}: Props): JSX.Element {
  const [mouseHover, setMouseHover] = useState<boolean>(false);

  function getBackground(): string {
    const bgColor = boxStyle.backgroundColor as string;
    const bgDarker = getDarkerColor(bgColor);
    if (isDisabled) {
      return getBrighterColor(bgColor);
    } else if (isSelected && mouseHover) {
      return getStripedBackground(bgDarker);
    } else if (isSelected) {
      return getStripedBackground(bgColor);
    } else if (mouseHover) {
      return bgDarker;
    } else {
      return bgColor;
    }
  }

  return (
    <div
      className="text-center small"
      style={{ filter: boxFilter }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      <div
        style={{
          lineHeight: "40px",
          fontWeight: "bold",
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
