import { HandleType, Position } from "reactflow";

import blockAssignment from "./assignment";
import blockConditional from "./conditional";
import blockEnd from "./end";
import blockInput from "./input";
import blockOutput from "./output";
import blockStart from "./start";

export interface BoxStyle {
  backgroundColor: string;
  textColor: string;
  borderRadius?: string;
  clipPath?: string;
  clipPathBorder?: string;
}

export interface BlockType {
  id: "start" | "read" | "write" | "assignment" | "conditional" | "end";
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

const blockTypes: BlockType[] = [
  blockStart,
  blockInput,
  blockOutput,
  blockAssignment,
  blockConditional,
  blockEnd,
];

export default blockTypes;
