import { Position } from "reactflow";

import { getBrighterColor, palette } from "~/utils/colors";

import { BlockType } from ".";

const block: BlockType = {
  id: "assignment",
  title: "Block_Assignment",
  boxStyle: {
    backgroundColor: getBrighterColor(palette.orange),
    textColor: "white",
  },
  modal: {
    matchStartRule: "Command_assignment",
    placeholder: "Block_AssignmentPlaceholder",
  },
  handles: [
    { id: "in", type: "target", position: Position.Top },
    { id: "out", type: "source", position: Position.Bottom },
  ],
};

export default block;
