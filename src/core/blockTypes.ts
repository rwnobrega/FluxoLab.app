import { HandleType, Position } from "reactflow";

import { getBrighterColor, palette } from "~/utils/colors";

export const blockTypeIds = [
  "start",
  "read",
  "write",
  "assignment",
  "conditional",
  "end",
] as const;
export type BlockTypeId = (typeof blockTypeIds)[number];

export interface BoxStyle {
  backgroundColor: string;
  textColor: string;
  borderRadius?: string;
  clipPath?: string;
  clipPathBorder?: string;
}

interface BlockType {
  title: string;
  prefixLabel?: string;
  boxStyle: BoxStyle;
  modal?: {
    prefixCommand?: string;
    matchStartRule: string;
    placeholder: string;
  };
  handles: Array<{
    id: string;
    label?: string;
    type: HandleType;
    position: Position;
  }>;
}

const blockTypes: Record<BlockTypeId, BlockType> = {
  start: {
    title: "Block_Start",
    prefixLabel: "Block_Start",
    boxStyle: {
      backgroundColor: getBrighterColor(palette.purple),
      textColor: "white",
      borderRadius: "15px",
    },
    handles: [{ id: "out", type: "source", position: Position.Bottom }],
  },
  read: {
    title: "Block_Input",
    prefixLabel: "Block_Read",
    boxStyle: {
      backgroundColor: getBrighterColor(palette.blue),
      textColor: "white",
      clipPath: "polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)",
      clipPathBorder:
        "polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))",
    },
    modal: {
      prefixCommand: "read ",
      matchStartRule: "Command_read",
      placeholder: "Block_InputPlaceholder",
    },
    handles: [
      { id: "in", type: "target", position: Position.Top },
      { id: "out", type: "source", position: Position.Bottom },
    ],
  },
  write: {
    title: "Block_Output",
    prefixLabel: "Block_Write",
    boxStyle: {
      backgroundColor: getBrighterColor(palette.green),
      textColor: "white",
      clipPath: "polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)",
      clipPathBorder:
        "polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))",
    },
    modal: {
      prefixCommand: "write ",
      matchStartRule: "Command_write",
      placeholder: "Block_OutputPlaceholder",
    },
    handles: [
      { id: "in", type: "target", position: Position.Top },
      { id: "out", type: "source", position: Position.Bottom },
    ],
  },
  assignment: {
    title: "Block_Assignment",
    boxStyle: {
      backgroundColor: getBrighterColor(palette.orange),
      textColor: "white",
    },
    modal: {
      matchStartRule: "Command_assignment",
      placeholder: "Block_AssignmentPlaceholder",
    },
    handles: [
      { id: "in", type: "target", position: Position.Top },
      { id: "out", type: "source", position: Position.Bottom },
    ],
  },
  conditional: {
    title: "Block_Conditional",
    boxStyle: {
      backgroundColor: getBrighterColor(palette.red),
      textColor: "white",
      clipPath:
        "polygon(20px 0, 0 50%, 20px 100%, calc(100% - 20px) 100%, 100% 50%, calc(100% - 20px) 0)",
    },
    modal: {
      matchStartRule: "Expression",
      placeholder: "Block_ConditionalPlaceholder",
    },
    handles: [
      { id: "in", type: "target", position: Position.Top },
      { id: "true", type: "source", position: Position.Bottom, label: "T" },
      { id: "false", type: "source", position: Position.Right, label: "F" },
    ],
  },
  end: {
    title: "Block_End",
    prefixLabel: "Block_End",
    boxStyle: {
      backgroundColor: getBrighterColor(palette.purple),
      textColor: "white",
      borderRadius: "15px",
    },
    handles: [{ id: "in", type: "target", position: Position.Top }],
  },
};

export function getBlockType(id: BlockTypeId): BlockType {
  return blockTypes[id];
}
