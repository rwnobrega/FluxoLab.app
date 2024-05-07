import { SimpleFlowchart } from "~/store/serialize";

const example: SimpleFlowchart = {
  title: "sign",
  variables: [{ id: "n", type: "number" }],
  nodes: [
    {
      id: "0",
      type: "start",
      position: { x: 300, y: 140 },
      data: "",
    },
    {
      id: "1",
      type: "read",
      position: { x: 300, y: 220 },
      data: "n",
    },
    {
      id: "2",
      type: "conditional",
      position: { x: 300, y: 300 },
      data: "n > 0",
    },
    {
      id: "3",
      type: "conditional",
      position: { x: 520, y: 300 },
      data: "n < 0",
    },
    {
      id: "4",
      type: "write",
      position: { x: 300, y: 380 },
      data: '"Positive"',
    },
    {
      id: "5",
      type: "write",
      position: { x: 520, y: 380 },
      data: '"Negative"',
    },
    {
      id: "6",
      type: "write",
      position: { x: 720, y: 380 },
      data: '"Zero"',
    },
    {
      id: "7",
      type: "end",
      position: { x: 720, y: 480 },
      data: "",
    },
  ],
  edges: [
    { source: "0", sourceHandle: "out", target: "1" },
    { source: "1", sourceHandle: "out", target: "2" },
    { source: "2", sourceHandle: "false", target: "3" },
    { source: "3", sourceHandle: "false", target: "6" },
    { source: "3", sourceHandle: "true", target: "5" },
    { source: "2", sourceHandle: "true", target: "4" },
    { source: "4", sourceHandle: "out", target: "7" },
    { source: "5", sourceHandle: "out", target: "7" },
    { source: "6", sourceHandle: "out", target: "7" },
  ],
};

export default example;
