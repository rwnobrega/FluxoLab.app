import { Position } from "reactflow";

import { getBrighterColor, palette } from "utils/colors";

import { Symbol } from "..";

import Label from "./Label";
import Modal from "./Modal";

const symbol: Symbol = {
  type: "assignment",
  title: "Symbol_Assignment",
  boxStyle: {
    backgroundColor: getBrighterColor(palette.orange),
    textColor: "white",
  },
  Modal: Modal,
  Label: Label,
  handles: [
    { id: "in", type: "target", position: Position.Top },
    { id: "out", type: "source", position: Position.Bottom },
  ],
};

export default symbol;
