import { Position } from "reactflow";

import { SimpleFlowchart } from "~/store/serialize";

import { Role } from "../roles";

const example: SimpleFlowchart = {
  title: "secret",
  variables: [
    { id: "secret", type: "number" },
    { id: "guess", type: "number" },
    { id: "tries", type: "number" },
  ],
  nodes: [
    {
      id: "0",
      role: Role.Start,
      position: { x: 480, y: -60 },
      payload: "",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "1",
      role: Role.Assign,
      position: { x: 480, y: 20 },
      payload: "secret = rand_int(1, 100)",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "2",
      role: Role.Assign,
      position: { x: 480, y: 100 },
      payload: "tries = 0",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "3",
      role: Role.Read,
      position: { x: 480, y: 180 },
      payload: "guess",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "4",
      role: Role.Assign,
      position: { x: 480, y: 260 },
      payload: "tries = tries + 1",
      handlePositions: { out: Position.Bottom },
    },
    {
      id: "5",
      role: Role.Conditional,
      position: { x: 480, y: 340 },
      payload: "secret > guess",
      handlePositions: { true: Position.Right, false: Position.Bottom },
    },
    {
      id: "6",
      role: Role.Write,
      position: { x: 720, y: 340 },
      payload: '"Secret is higher"',
      handlePositions: { out: Position.Right },
    },
    {
      id: "7",
      role: Role.Conditional,
      position: { x: 480, y: 420 },
      payload: "secret < guess",
      handlePositions: { true: Position.Right, false: Position.Bottom },
    },
    {
      id: "8",
      role: Role.Write,
      position: { x: 720, y: 420 },
      payload: '"Secret is lower"',
      handlePositions: { out: Position.Right },
    },
    {
      id: "9",
      role: Role.Conditional,
      position: { x: 480, y: 500 },
      payload: "secret != guess",
      handlePositions: { true: Position.Left, false: Position.Bottom },
    },
    {
      id: "10",
      role: Role.Write,
      position: { x: 480, y: 580 },
      payload: '"Congratulations! ", tries, " tries."',
      handlePositions: { out: Position.Right },
    },
    {
      id: "11",
      role: Role.End,
      position: { x: 760, y: 580 },
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
    { source: "5", sourceHandle: "false", target: "7" },
    { source: "5", sourceHandle: "true", target: "6" },
    { source: "6", sourceHandle: "out", target: "9" },
    { source: "7", sourceHandle: "false", target: "9" },
    { source: "7", sourceHandle: "true", target: "8" },
    { source: "8", sourceHandle: "out", target: "9" },
    { source: "9", sourceHandle: "false", target: "10" },
    { source: "9", sourceHandle: "true", target: "3" },
    { source: "10", sourceHandle: "out", target: "11" },
  ],
};

export default example;
