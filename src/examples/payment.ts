import { Position } from "reactflow";

import { SimpleFlowchart } from "~/store/serialize";

import { DataType } from "../core/dataTypes";
import { Role } from "../core/roles";

const example: SimpleFlowchart = {
  title: "payment",
  variables: [
    { id: "sal", type: DataType.Number },
    { id: "hrs", type: DataType.Number },
    { id: "pay", type: DataType.Number },
    { id: "tot", type: DataType.Number },
    { id: "i", type: DataType.Number },
  ],
  nodes: [
    {
      id: "0",
      role: Role.Start,
      position: { x: 120, y: 80 },
      payload: "",
      handlePositions: { out: Position.Right },
    },
    {
      id: "1",
      role: Role.Assign,
      position: { x: 260, y: 80 },
      payload: "tot = 0",
      handlePositions: { out: Position.Right },
    },
    {
      id: "2",
      role: Role.Assign,
      position: { x: 400, y: 80 },
      payload: "i = 1",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "3",
      role: Role.Conditional,
      position: { x: 400, y: 160 },
      payload: "i <= 3",
      handlePositions: { true: Position.Bottom, false: Position.Right },
    },
    {
      id: "4",
      role: Role.Read,
      position: { x: 400, y: 240 },
      payload: "sal, hrs",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "5",
      role: Role.Assign,
      position: { x: 400, y: 320 },
      payload: "pay = hrs * sal",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "6",
      role: Role.Write,
      position: { x: 400, y: 400 },
      payload: "pay",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "7",
      role: Role.Assign,
      position: { x: 400, y: 480 },
      payload: "tot = tot + pay",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "8",
      role: Role.Assign,
      position: { x: 400, y: 560 },
      payload: "i = i + 1",
      handlePositions: { out: Position.Left },
    },
    {
      id: "9",
      role: Role.Write,
      position: { x: 580, y: 160 },
      payload: "tot",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "10",
      role: Role.End,
      position: { x: 580, y: 240 },
      payload: "",
      handlePositions: {},
    },
  ],
  edges: [
    { source: "0", sourceHandle: "out", target: "1" },
    { source: "1", sourceHandle: "out", target: "2" },
    { source: "2", sourceHandle: "out", target: "3" },
    { source: "3", sourceHandle: "true", target: "4" },
    { source: "3", sourceHandle: "false", target: "9" },
    { source: "4", sourceHandle: "out", target: "5" },
    { source: "5", sourceHandle: "out", target: "6" },
    { source: "6", sourceHandle: "out", target: "7" },
    { source: "7", sourceHandle: "out", target: "8" },
    { source: "8", sourceHandle: "out", target: "3" },
    { source: "9", sourceHandle: "out", target: "10" },
  ],
};

export default example;
