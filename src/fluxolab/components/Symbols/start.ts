import { Position } from "reactflow";

import { getBrighterColor, palette } from "utils/colors";

import { Symbol } from ".";

const symbol: Symbol = {
  type: "start",
  title: "Symbol_Start",
  prefixLabel: "Symbol_Start",
  boxStyle: {
    backgroundColor: getBrighterColor(palette.purple),
    textColor: "white",
    borderRadius: "15px",
  },
  handles: [{ id: "out", type: "source", position: Position.Bottom }],
};

export default symbol;
