import { HandleType, Position } from "reactflow";

import symbolStart from "./start";
import symbolInput from "./input";
import symbolOutput from "./output";
import symbolAssignment from "./assignment";
import symbolConditional from "./conditional";
import symbolEnd from "./end";

export interface BoxStyle {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  clipPath?: string;
  clipPathBorder?: string;
}

export interface Symbol {
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

const symbols: Symbol[] = [
  symbolStart,
  symbolInput,
  symbolOutput,
  symbolAssignment,
  symbolConditional,
  symbolEnd,
];

export default symbols;
