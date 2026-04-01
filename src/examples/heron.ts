import { Position } from "reactflow";

import { SimpleFlowchart } from "~/store/serialize";

import { DataType } from "../core/dataTypes";
import { Role } from "../core/roles";

const example: SimpleFlowchart = {
  title: "heron",
  variables: [
    { id: "a", type: DataType.Number },
    { id: "b", type: DataType.Number },
    { id: "c", type: DataType.Number },
    { id: "s", type: DataType.Number },
    { id: "area", type: DataType.Number },
  ],
  nodes: [
    {
      id: "0",
      role: Role.Start,
      position: { x: 400, y: 80 },
      payload: "",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "1",
      role: Role.Read,
      position: { x: 400, y: 160 },
      payload: "a, b, c",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "2",
      role: Role.Assign,
      position: { x: 400, y: 240 },
      payload: "s = (a + b + c) / 2",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "3",
      role: Role.Assign,
      position: { x: 400, y: 320 },
      payload: "area = sqrt(s * (s - a) * (s - b) * (s - c))",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "4",
      role: Role.Write,
      position: { x: 400, y: 400 },
      payload: "area",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "5",
      role: Role.End,
      position: { x: 400, y: 480 },
      payload: "",
      handlePositions: {},
    },
  ],
  edges: [
    { source: "0", sourceHandle: "out", target: "1" },
    { source: "1", sourceHandle: "out", target: "2" },
    { source: "2", sourceHandle: "out", target: "3" },
    { source: "3", sourceHandle: "out", target: "4" },
    { source: "4", sourceHandle: "out", target: "5" },
  ],
};

export default example;
