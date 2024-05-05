import { HandleType, Position } from "reactflow";

import colors from "~/utils/colors";
import palette from "~/utils/palette";

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
  prefixCommand: string;
  hasModal: boolean;
  handles: Array<{
    id: string;
    label?: string;
    type: HandleType;
    position: Position;
  }>;
  boxStyle: BoxStyle;
}

const blockTypes: Record<BlockTypeId, BlockType> = {
  start: {
    prefixCommand: "start",
    hasModal: false,
    handles: [{ id: "out", type: "source", position: Position.Bottom }],
    boxStyle: {
      backgroundColor: colors.brighter(palette.purple),
      textColor: "white",
      borderRadius: "15px",
    },
  },
  read: {
    prefixCommand: "read ",
    hasModal: true,
    handles: [
      { id: "in", type: "target", position: Position.Top },
      { id: "out", type: "source", position: Position.Bottom },
    ],
    boxStyle: {
      backgroundColor: colors.brighter(palette.blue),
      textColor: "white",
      clipPath: "polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)",
      clipPathBorder:
        "polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))",
    },
  },
  write: {
    prefixCommand: "write ",
    hasModal: true,
    handles: [
      { id: "in", type: "target", position: Position.Top },
      { id: "out", type: "source", position: Position.Bottom },
    ],
    boxStyle: {
      backgroundColor: colors.brighter(palette.green),
      textColor: "white",
      clipPath: "polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)",
      clipPathBorder:
        "polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))",
    },
  },
  assignment: {
    prefixCommand: "",
    hasModal: true,
    handles: [
      { id: "in", type: "target", position: Position.Top },
      { id: "out", type: "source", position: Position.Bottom },
    ],
    boxStyle: {
      backgroundColor: colors.brighter(palette.orange),
      textColor: "white",
    },
  },
  conditional: {
    prefixCommand: "conditional ",
    hasModal: true,
    handles: [
      { id: "in", type: "target", position: Position.Top },
      { id: "true", type: "source", position: Position.Bottom, label: "T" },
      { id: "false", type: "source", position: Position.Right, label: "F" },
    ],
    boxStyle: {
      backgroundColor: colors.brighter(palette.red),
      textColor: "white",
      clipPath:
        "polygon(20px 0, 0 50%, 20px 100%, calc(100% - 20px) 100%, 100% 50%, calc(100% - 20px) 0)",
    },
  },
  end: {
    hasModal: false,
    prefixCommand: "",
    handles: [{ id: "in", type: "target", position: Position.Top }],
    boxStyle: {
      backgroundColor: colors.brighter(palette.purple),
      textColor: "white",
      borderRadius: "15px",
    },
  },
};

export function getBlockType(id: BlockTypeId): BlockType {
  return blockTypes[id];
}
