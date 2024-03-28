import { Position } from "reactflow";

import { getBrighterColor, palette } from "utils/colors";

import { Symbol } from ".";

const symbol: Symbol = {
  type: "end",
  title: "Symbol_End",
  prefixLabel: "Symbol_End",
  boxStyle: {
    backgroundColor: getBrighterColor(palette.purple),
    textColor: "white",
    borderRadius: "15px",
  },
  handles: [{ id: "in", type: "target", position: Position.Top }],
};

export default symbol;
