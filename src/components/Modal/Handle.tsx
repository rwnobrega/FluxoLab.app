import React, { CSSProperties } from "react";
import { useDrag } from "react-dnd";
import { Position } from "reactflow";

import { BoxStyle } from "~/core/blockTypes";
import colors from "~/utils/colors";

import { DragItem } from "./DraggingBox";

interface Props {
  id: string;
  label: string;
  position: Position;
  boxStyle: BoxStyle;
}
export default function ({ id, label, position, boxStyle }: Props) {
  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >(() => ({
    type: "handle",
    item: { id, label, position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  function getStylePosition(position: Position) {
    switch (position) {
      case Position.Top:
        return { top: "0%", left: "50%", transform: "translate(-50%, -50%)" };
      case Position.Bottom:
        return { bottom: "0%", left: "50%", transform: "translate(-50%, 50%)" };
      case Position.Left:
        return { left: "0%", top: "50%", transform: "translate(-50%, -50%)" };
      case Position.Right:
        return { right: "0%", top: "50%", transform: "translate(50%, -50%)" };
    }
  }

  const style: CSSProperties = {
    position: "absolute",
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    fontSize: "10px",
    fontWeight: "bold",
    textAlign: "center",
    color: boxStyle.textColor,
    backgroundColor: boxStyle.backgroundColor,
    border: `1px solid ${colors.darker(boxStyle.backgroundColor)}`,
    cursor: "grab",
    userSelect: "none",
    ...getStylePosition(position),
  };

  return (
    <div ref={drag} style={style}>
      {label}
    </div>
  );
}
