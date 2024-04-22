import React, { useState } from "react";

import { BoxStyle } from "~/components/Blocks";
import useStoreMachineState from "~/store/useStoreMachineState";
import useStoreStrings from "~/store/useStoreStrings";
import { getBrighterColor, getDarkerColor } from "~/utils/colors";

interface Props {
  type: string;
  title: string;
  boxStyle: BoxStyle;
}

export default function ({ type, title, boxStyle }: Props): JSX.Element {
  const { getString } = useStoreStrings();
  const { getState } = useStoreMachineState();
  const [mouseHover, setMouseHover] = useState<boolean>(false);

  const state = getState();
  const isDisabled = state.timeSlot >= 0;

  function onDragStart(event: React.DragEvent<HTMLDivElement>): void {
    event.dataTransfer.setData("application/text", type);
    event.dataTransfer.effectAllowed = "move";
  }

  function getBackground(): string {
    if (isDisabled) {
      return getBrighterColor(boxStyle.backgroundColor);
    } else if (mouseHover) {
      return getDarkerColor(boxStyle.backgroundColor);
    } else {
      return boxStyle.backgroundColor;
    }
  }

  return (
    <div
      className="text-center fw-bold small"
      draggable={!isDisabled}
      onDragStart={onDragStart}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      style={{
        cursor: isDisabled ? "auto" : "grab",
        lineHeight: "40px",
        width: 120,
        color: boxStyle.textColor,
        background: getBackground(),
        borderRadius: boxStyle.borderRadius,
        clipPath: boxStyle.clipPath,
      }}
    >
      <span>{getString(title)}</span>
    </div>
  );
}
