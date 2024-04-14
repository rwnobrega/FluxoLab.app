import { Example } from ".";

const example: Example = {
  title: "Sign of a number",
  description: "Determines if a number is positive, negative, or zero.",
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
      position: { x: 280, y: 220 },
      data: "n",
    },
    {
      id: "2",
      type: "conditional",
      position: { x: 280, y: 300 },
      data: "n > 0",
    },
    {
      id: "3",
      type: "conditional",
      position: { x: 480, y: 300 },
      data: "n < 0",
    },
    {
      id: "4",
      type: "write",
      position: { x: 240, y: 380 },
      data: '"Positive"',
    },
    {
      id: "5",
      type: "write",
      position: { x: 440, y: 380 },
      data: '"Negative"',
    },
    {
      id: "6",
      type: "write",
      position: { x: 640, y: 380 },
      data: '"Zero"',
    },
    {
      id: "7",
      type: "end",
      position: { x: 680, y: 480 },
      data: "",
    },
  ],
  edges: [
    { source: "0", sourceHandle: "out", target: "1", targetHandle: "in" },
    { source: "1", sourceHandle: "out", target: "2", targetHandle: "in" },
    { source: "2", sourceHandle: "false", target: "3", targetHandle: "in" },
    { source: "3", sourceHandle: "false", target: "6", targetHandle: "in" },
    { source: "3", sourceHandle: "true", target: "5", targetHandle: "in" },
    { source: "2", sourceHandle: "true", target: "4", targetHandle: "in" },
    { source: "4", sourceHandle: "out", target: "7", targetHandle: "in" },
    { source: "5", sourceHandle: "out", target: "7", targetHandle: "in" },
    { source: "6", sourceHandle: "out", target: "7", targetHandle: "in" },
  ],
};

export default example;
