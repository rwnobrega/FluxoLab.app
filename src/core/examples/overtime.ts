import { SimpleFlowchart } from "~/store/serialize";

const example: SimpleFlowchart = {
  title: "overtime",
  variables: [
    { id: "hours", type: "number" },
    { id: "pay", type: "number" },
  ],
  nodes: [
    {
      id: "0",
      type: "start",
      position: { x: 400, y: 80 },
      payload: "",
    },
    {
      id: "1",
      type: "read",
      position: { x: 400, y: 160 },
      payload: "hours",
    },
    {
      id: "2",
      type: "assignment",
      position: { x: 400, y: 240 },
      payload: "pay = 50 * hours",
    },
    {
      id: "3",
      type: "conditional",
      position: { x: 400, y: 320 },
      payload: "hours > 8",
    },
    {
      id: "4",
      type: "assignment",
      position: { x: 400, y: 400 },
      payload: "pay = pay + 25 * (hours - 8)",
    },
    {
      id: "5",
      type: "write",
      position: { x: 400, y: 480 },
      payload: '"The payment is $", pay, "."',
    },
    {
      id: "6",
      type: "end",
      position: { x: 400, y: 560 },
      payload: "",
    },
  ],
  edges: [
    { source: "0", sourceHandle: "out", target: "1" },
    { source: "1", sourceHandle: "out", target: "2" },
    { source: "2", sourceHandle: "out", target: "3" },
    { source: "3", sourceHandle: "true", target: "4" },
    { source: "4", sourceHandle: "out", target: "5" },
    { source: "5", sourceHandle: "out", target: "6" },
    { source: "3", sourceHandle: "false", target: "5" },
  ],
};

export default example;
