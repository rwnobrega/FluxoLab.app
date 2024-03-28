import { Position } from "reactflow";

import { getBrighterColor, palette } from "utils/colors";

import { Symbol } from "..";

import Label from "./Label";

const symbol: Symbol = {
  type: "assignment",
  title: "Symbol_Assignment",
  boxStyle: {
    backgroundColor: getBrighterColor(palette.orange),
    textColor: "white",
  },
  modal: {
    title: "Symbol_Assignment",
    matchStartRule: "Command_assignment",
    placeholder: "Symbol_AssignmentPlaceholder",
  },
  Label: Label,
  handles: [
    { id: "in", type: "target", position: Position.Top },
    { id: "out", type: "source", position: Position.Bottom },
  ],
};

export default symbol;
