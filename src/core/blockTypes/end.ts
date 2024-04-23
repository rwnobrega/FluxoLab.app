import { Position } from "reactflow";

import { getBrighterColor, palette } from "~/utils/colors";

import { BlockType } from ".";

const block: BlockType = {
  id: "end",
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
