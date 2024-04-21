import React from "react";

import { BoxStyle } from "~/components/Blocks";
import Box from "~/components/Blocks/Box";
import useStoreMachineState from "~/store/useStoreMachineState";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  type: string;
  title: string;
  boxStyle: BoxStyle;
}

export default function ({ type, title, boxStyle }: Props): JSX.Element {
  const { getString } = useStoreStrings();
  const { getState } = useStoreMachineState();

  const state = getState();
  const disabled = state.timeSlot >= 0;

  function onDragStart(event: any): void {
    const mouseX = event.pageX - event.target.offsetLeft;
    const mouseY = event.pageY - event.target.offsetTop;
    const data = JSON.stringify({ type, mouseX, mouseY });
    event.dataTransfer.setData("application/reactflow", data);
    event.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      draggable={!disabled}
      onDragStart={onDragStart}
      style={{
        cursor: disabled ? "auto" : "grab",
        width: 120,
      }}
    >
      <Box boxStyle={boxStyle} isDisabled={disabled}>
        <span>{getString(title)}</span>
      </Box>
    </div>
  );
}
