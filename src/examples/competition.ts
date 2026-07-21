import { Position } from "reactflow";

import { SimpleFlowchart } from "~/store/serialize";

import { DataType } from "../core/dataTypes";
import { Role } from "../core/roles";

const example: SimpleFlowchart = {
  title: "competition",
  variables: [
    { id: "score1", type: DataType.Number },
    { id: "score2", type: DataType.Number },
    { id: "duration", type: DataType.Number },
    { id: "average", type: DataType.Number },
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
      payload: "score1, score2",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "2",
      role: Role.Read,
      position: { x: 400, y: 240 },
      payload: "duration",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "3",
      role: Role.Assign,
      position: { x: 400, y: 320 },
      payload: "average = round((score1 + score2) / 2)",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "4",
      role: Role.Conditional,
      position: { x: 400, y: 400 },
      payload: "average >= 6 && duration <= 3.5",
      handlePositions: { true: Position.Left, false: Position.Right },
    },
    {
      id: "5",
      role: Role.Write,
      position: { x: 240, y: 480 },
      payload: '"Qualified"',
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "6",
      role: Role.Write,
      position: { x: 560, y: 480 },
      payload: '"Not qualified"',
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "7",
      role: Role.End,
      position: { x: 400, y: 560 },
      payload: "",
      handlePositions: {},
    },
  ],
  edges: [
    { source: "0", sourceHandle: "out", target: "1" },
    { source: "1", sourceHandle: "out", target: "2" },
    { source: "2", sourceHandle: "out", target: "3" },
    { source: "3", sourceHandle: "out", target: "4" },
    { source: "4", sourceHandle: "true", target: "5" },
    { source: "4", sourceHandle: "false", target: "6" },
    { source: "5", sourceHandle: "out", target: "7" },
    { source: "6", sourceHandle: "out", target: "7" },
  ],
};

export default example;
