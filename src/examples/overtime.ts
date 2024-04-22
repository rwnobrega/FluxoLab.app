import { Example } from ".";

const example: Example = {
  title: "Overtime work",
  description: "Computes the payment taking into account overtime.",
  variables: [
    { id: "hours", type: "number" },
    { id: "pay", type: "number" },
  ],
  nodes: [
    {
      id: "0",
      type: "start",
      position: { x: 400, y: 80 },
      data: "",
    },
    {
      id: "1",
      type: "read",
      position: { x: 400, y: 160 },
      data: "hours",
    },
    {
      id: "2",
      type: "assignment",
      position: { x: 400, y: 240 },
      data: "pay = 50 * hours",
    },
    {
      id: "3",
      type: "conditional",
      position: { x: 400, y: 320 },
      data: "hours > 8",
    },
    {
      id: "4",
      type: "assignment",
      position: { x: 400, y: 400 },
      data: "pay = pay + 25 * (hours - 8)",
    },
    {
      id: "5",
      type: "write",
      position: { x: 400, y: 480 },
      data: '"The payment is $", pay, "."',
    },
    {
      id: "6",
      type: "end",
      position: { x: 400, y: 560 },
      data: "",
    },
  ],
  edges: [
    { source: "0", sourceHandle: "out", target: "1", targetHandle: "in" },
    { source: "1", sourceHandle: "out", target: "2", targetHandle: "in" },
    { source: "2", sourceHandle: "out", target: "3", targetHandle: "in" },
    { source: "3", sourceHandle: "true", target: "4", targetHandle: "in" },
    { source: "4", sourceHandle: "out", target: "5", targetHandle: "in" },
    { source: "5", sourceHandle: "out", target: "6", targetHandle: "in" },
    { source: "3", sourceHandle: "false", target: "5", targetHandle: "in" },
  ],
};

export default example;
