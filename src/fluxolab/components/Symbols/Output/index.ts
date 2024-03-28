import { Position } from "reactflow";

import { getBrighterColor, palette } from "utils/colors";

import { Symbol } from "..";

import Label from "./Label";

const symbol: Symbol = {
  type: "write",
  title: "Symbol_Output",
  boxStyle: {
    backgroundColor: getBrighterColor(palette.green),
    textColor: "white",
    clipPath: "polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)",
    clipPathBorder:
      "polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))",
  },
  Label: Label,
  modal: {
    title: "Symbol_Output",
    prefixLabel: "Symbol_Write",
    prefixCommand: "write ",
    matchStartRule: "Command_write",
    placeholder: "Symbol_OutputPlaceholder",
  },
  handles: [
    { id: "in", type: "target", position: Position.Top },
    { id: "out", type: "source", position: Position.Bottom },
  ],
};

export default symbol;
