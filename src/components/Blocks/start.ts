import { Position } from "reactflow";

import { getBrighterColor, palette } from "~/utils/colors";

import { Block } from ".";

const block: Block = {
  type: "start",
  title: "Block_Start",
  prefixLabel: "Block_Start",
  boxStyle: {
    backgroundColor: getBrighterColor(palette.purple),
    textColor: "white",
    borderRadius: "15px",
  },
  handles: [{ id: "out", type: "source", position: Position.Bottom }],
};

export default block;
