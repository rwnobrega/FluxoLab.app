import { Position } from "reactflow";

import { getBrighterColor, palette } from "utils/colors";

import { Block } from ".";

const block: Block = {
  type: "end",
  title: "Block_End",
  prefixLabel: "Block_End",
  boxStyle: {
    backgroundColor: getBrighterColor(palette.purple),
    textColor: "white",
    borderRadius: "15px",
  },
  handles: [{ id: "in", type: "target", position: Position.Top }],
};

export default block;
