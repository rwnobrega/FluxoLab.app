import { HandleType, Position } from "reactflow";

import symbolStart from "./Start";
import symbolInput from "./Input";
import symbolOutput from "./Output";
import symbolAssignment from "./Assignment";
import symbolConditional from "./Conditional";
import symbolEnd from "./End";

export interface BoxStyle {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  clipPath?: string;
  clipPathBorder?: string;
}

export interface LabelProps {
  value: string;
}

export interface Symbol {
  type: string;
  title: string;
  boxStyle: BoxStyle;
  Label: (props: LabelProps) => JSX.Element;
  modal?: {
    title: string;
    prefixLabel?: string;
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
