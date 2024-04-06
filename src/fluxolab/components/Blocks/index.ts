import { HandleType, Position } from "reactflow";

import blockStart from "./start";
import blockInput from "./input";
import blockOutput from "./output";
import blockAssignment from "./assignment";
import blockConditional from "./conditional";
import blockEnd from "./end";

export interface BoxStyle {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  clipPath?: string;
  clipPathBorder?: string;
}

export interface Block {
  type: string;
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

const blocks: Block[] = [
  blockStart,
  blockInput,
  blockOutput,
  blockAssignment,
  blockConditional,
  blockEnd,
];

export default blocks;
