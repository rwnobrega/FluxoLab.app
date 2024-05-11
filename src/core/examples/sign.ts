import { Position } from "reactflow";

import { SimpleFlowchart } from "~/store/serialize";

import { Role } from "../roles";

const example: SimpleFlowchart = {
  title: "sign",
  variables: [{ id: "n", type: "number" }],
  nodes: [
    {
      id: "0",
      role: Role.Start,
      position: { x: 300, y: 140 },
      payload: "",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "1",
      role: Role.Read,
      position: { x: 300, y: 220 },
      payload: "n",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "2",
      role: Role.Conditional,
      position: { x: 300, y: 300 },
      payload: "n > 0",
      handlePositions: { true: Position.Bottom, false: Position.Right },
    },
    {
      id: "3",
      role: Role.Conditional,
      position: { x: 520, y: 300 },
      payload: "n < 0",
      handlePositions: { true: Position.Bottom, false: Position.Right },
    },
    {
      id: "4",
      role: Role.Write,
      position: { x: 300, y: 380 },
      payload: '"Positive"',
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "5",
      role: Role.Write,
      position: { x: 520, y: 380 },
      payload: '"Negative"',
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "6",
      role: Role.Write,
      position: { x: 720, y: 380 },
      payload: '"Zero"',
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "7",
      role: Role.End,
      position: { x: 720, y: 480 },
      payload: "",
      handlePositions: {},
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
