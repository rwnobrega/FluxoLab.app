import React, { useState } from "react";

import { BlockTypeId, getBlockType } from "~/core/blockTypes";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";
import colors from "~/utils/colors";

interface Props {
  blockTypeId: BlockTypeId;
}

export default function ({ blockTypeId }: Props): JSX.Element {
  const { getString } = useStoreStrings();
  const { machineState } = useStoreMachine();
  const [mouseHover, setMouseHover] = useState<boolean>(false);

  const { title, boxStyle } = getBlockType(blockTypeId);

  const isDisabled =
    machineState.status === "running" || machineState.status === "waiting";

  function onDragStart(event: React.DragEvent<HTMLDivElement>): void {
    event.dataTransfer.setData("application/text", blockTypeId);
    event.dataTransfer.effectAllowed = "move";
  }

  function getBackground(): string {
    if (isDisabled) {
      return colors.brighter(boxStyle.backgroundColor);
    } else if (mouseHover) {
      return colors.darker(boxStyle.backgroundColor);
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
