import { Position } from "reactflow";

import { getBrighterColor, palette } from "utils/colors";

import { Block } from ".";

const block: Block = {
  type: "read",
  title: "Block_Input",
  prefixLabel: "Block_Read",
  boxStyle: {
    backgroundColor: getBrighterColor(palette.blue),
    textColor: "white",
    clipPath: "polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)",
    clipPathBorder:
      "polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))",
  },
  modal: {
    prefixCommand: "read ",
    matchStartRule: "Command_read",
    placeholder: "Block_InputPlaceholder",
  },
  handles: [
    { id: "in", type: "target", position: Position.Top },
    { id: "out", type: "source", position: Position.Bottom },
  ],
};

export default block;
