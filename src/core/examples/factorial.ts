import { SimpleFlowchart } from "~/store/serialize";

const example: SimpleFlowchart = {
  title: "factorial",
  variables: [
    { id: "n", type: "number" },
    { id: "fat", type: "number" },
  ],
  nodes: [
    {
      id: "0",
      type: "start",
      position: { x: 400, y: 120 },
      data: "",
    },
    {
      id: "1",
      type: "assignment",
      position: { x: 400, y: 280 },
      data: "fat = 1",
    },
    {
      id: "2",
      type: "read",
      position: { x: 400, y: 200 },
      data: "n",
    },
    {
      id: "3",
      type: "conditional",
      position: { x: 400, y: 360 },
      data: "n > 1",
    },
    {
      id: "4",
      type: "assignment",
      position: { x: 400, y: 440 },
      data: "fat = fat * n",
    },
    {
      id: "5",
      type: "assignment",
      position: { x: 400, y: 520 },
      data: "n = n - 1",
    },
    {
      id: "6",
      type: "write",
      position: { x: 580, y: 360 },
      data: "fat",
    },
    {
      id: "7",
      type: "end",
      position: { x: 580, y: 440 },
      data: "",
    },
  ],
  edges: [
    { source: "2", sourceHandle: "out", target: "1" },
    { source: "3", sourceHandle: "true", target: "4" },
    { source: "4", sourceHandle: "out", target: "5" },
    { source: "3", sourceHandle: "false", target: "6" },
    { source: "6", sourceHandle: "out", target: "7" },
    { source: "1", sourceHandle: "out", target: "3" },
    { source: "5", sourceHandle: "out", target: "3" },
    { source: "0", sourceHandle: "out", target: "2" },
  ],
};

export default example;
