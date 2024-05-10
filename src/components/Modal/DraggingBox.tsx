import _ from "lodash";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Position } from "reactflow";

import { BoxStyle } from "~/core/blockTypes";
import { NodeData } from "~/store/useStoreFlowchart";

import Handle from "./Handle";
import PositionZone from "./PositionZone";

export type DragItem = { id: string; position: Position };
export type HandlePositions = NodeData["handlePositions"];

interface Props {
  handles: any;
  handlePositions: HandlePositions;
  setHandlePositions: (handlePositions: HandlePositions) => void;
  boxStyle: BoxStyle;
}

export default function ({
  handles,
  handlePositions,
  setHandlePositions,
  boxStyle,
}: Props) {
  const onDrop = (id: string, position: Position) => {
    setHandlePositions({ ...handlePositions, [id]: position });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ position: "relative", width: 90, minHeight: 30 }}>
        <div
          style={{
            position: "relative",
            width: 90,
            height: 30,
            color: boxStyle.textColor,
            background: boxStyle.backgroundColor,
            borderRadius: boxStyle.borderRadius,
            clipPath: boxStyle.clipPath,
          }}
        >
          {_.map(Position, (pos) => (
            <PositionZone key={pos} position={pos} onDrop={onDrop} />
          ))}
        </div>
        {_.map(handles, ({ id, label }) => (
          <Handle
            key={id}
            id={id}
            label={label}
            position={handlePositions[id]}
            boxStyle={boxStyle}
          />
        ))}
      </div>
    </DndProvider>
  );
}
