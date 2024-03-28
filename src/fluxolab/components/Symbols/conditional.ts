import { Position } from "reactflow";

import { getBrighterColor, palette } from "utils/colors";

import { Symbol } from ".";

const symbol: Symbol = {
  type: "conditional",
  title: "Symbol_Conditional",
  boxStyle: {
    backgroundColor: getBrighterColor(palette.red),
    textColor: "white",
    clipPath:
      "polygon(20px 0, 0 50%, 20px 100%, calc(100% - 20px) 100%, 100% 50%, calc(100% - 20px) 0)",
  },
  modal: {
    matchStartRule: "Expression",
    placeholder: "Symbol_ConditionalPlaceholder",
  },
  handles: [
    { id: "in", type: "target", position: Position.Top },
    { id: "true", type: "source", position: Position.Bottom, label: "T" },
    { id: "false", type: "source", position: Position.Right, label: "F" },
  ],
};

export default symbol;
