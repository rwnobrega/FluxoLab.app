import React, { CSSProperties } from "react";
import { useDrop } from "react-dnd";
import { Position } from "reactflow";

import { DragItem } from "./DraggingBox";

interface Props {
  position: Position;
  onDrop: (handleId: string, position: Position) => void;
}
export default function ({ position, onDrop }: Props) {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "handle",
    drop: (item) => onDrop(item.id, position),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function getStylePosition(position: Position) {
    switch (position) {
      case Position.Top:
        return { top: 0, left: "50%", transform: "translateX(-50%)" };
      case Position.Bottom:
        return { bottom: 0, left: "50%", transform: "translateX(-50%)" };
      case Position.Left:
        return { left: 0, top: "50%", transform: "translateY(-50%)" };
      case Position.Right:
        return { right: 0, top: "50%", transform: "translateY(-50%)" };
    }
  }

  const style: CSSProperties = {
    position: "absolute",
    width: 40,
    height: 20,
    backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : "transparent",
    ...getStylePosition(position),
  };

  return <div ref={drop} style={style} />;
}
