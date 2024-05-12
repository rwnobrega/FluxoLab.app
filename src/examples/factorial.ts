import { Position } from "reactflow";

import { SimpleFlowchart } from "~/store/serialize";

import { DataType } from "../core/dataTypes";
import { Role } from "../core/roles";

const example: SimpleFlowchart = {
  title: "factorial",
  variables: [
    { id: "n", type: DataType.Number },
    { id: "fat", type: DataType.Number },
  ],
  nodes: [
    {
      id: "0",
      role: Role.Start,
      position: { x: 400, y: 120 },
      payload: "",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "1",
      role: Role.Assign,
      position: { x: 400, y: 280 },
      payload: "fat = 1",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "2",
      role: Role.Read,
      position: { x: 400, y: 200 },
      payload: "n",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "3",
      role: Role.Conditional,
      position: { x: 400, y: 360 },
      payload: "n > 1",
      handlePositions: { true: Position.Bottom, false: Position.Right },
    },
    {
      id: "4",
      role: Role.Assign,
      position: { x: 400, y: 440 },
      payload: "fat = fat * n",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "5",
      role: Role.Assign,
      position: { x: 400, y: 520 },
      payload: "n = n - 1",
      handlePositions: { out: Position.Left },
    },
    {
      id: "6",
      role: Role.Write,
      position: { x: 580, y: 360 },
      payload: "fat",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "7",
      role: Role.End,
      position: { x: 580, y: 440 },
      payload: "",
      handlePositions: {},
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
