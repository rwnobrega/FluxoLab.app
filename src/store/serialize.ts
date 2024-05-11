import _ from "lodash";
import {
  compressToEncodedURIComponent as compress,
  decompressFromEncodedURIComponent as decompress,
} from "lz-string";
import { Position } from "reactflow";

import { DataType } from "~/core/dataTypes";
import { Role, getRoleHandles } from "~/core/roles";

import { Flowchart, NodeData } from "./useStoreFlowchart";

const revAlias = [
  "number",
  "string",
  "boolean",
  "start",
  "read",
  "write",
  "assign",
  "conditional",
  "end",
  "in",
  "out",
  "true",
  "false",
];
const dirAlias = _.fromPairs(_.map(revAlias, (item, index) => [item, index]));

interface SimpleNode {
  id: string;
  role: Role;
  position: { x: number; y: number };
  payload: NodeData["payload"];
  handlePositions: NodeData["handlePositions"];
}

interface SimpleEdge {
  source: string;
  sourceHandle: string;
  target: string;
}

export interface SimpleFlowchart {
  title: Flowchart["title"];
  variables: Flowchart["variables"];
  nodes: SimpleNode[];
  edges: SimpleEdge[];
}

type MiniFlowchart = [
  string, // title
  Array<[string, number]>, // variables (id, type)
  Array<[number, number, number, number, string, Position[]]>, // nodes (id, role, x, y, payload, handlePositions)
  Array<[number, number, number]>, // edges (source, sourceHandle, target)
];

function simplify(flowchart: Flowchart): SimpleFlowchart {
  const { title, variables, nodes, edges } = flowchart;
  const nodes0 = _.map(nodes, (node) => ({
    id: node.id,
    role: node.data.role,
    position: node.position,
    payload: node.data.payload,
    handlePositions: node.data.handlePositions,
  }));
  const edges0 = _.map(edges, ({ source, target, sourceHandle }) => ({
    source,
    target,
    sourceHandle: sourceHandle as string,
  }));
  return { title, variables, nodes: nodes0, edges: edges0 };
}

function minify(simpleFlowchart: SimpleFlowchart): MiniFlowchart {
  const { title, variables, nodes, edges } = simpleFlowchart;
  return [
    title,
    _.map(variables, (variable) => [variable.id, dirAlias[variable.type]]),
    _.map(nodes, (node) => [
      parseInt(node.id),
      dirAlias[node.role],
      node.position.x,
      node.position.y,
      node.payload,
      _.values(node.handlePositions),
    ]),
    _.map(edges, (edge) => [
      parseInt(edge.source),
      dirAlias[edge.sourceHandle],
      parseInt(edge.target),
    ]),
  ];
}

function expand(miniFlowchart: MiniFlowchart): SimpleFlowchart {
  const [title, variables, nodes, edges] = miniFlowchart;
  const variables0 = _.map(variables, ([id, type]) => ({
    id,
    type: revAlias[type] as DataType,
  }));
  return {
    title,
    variables: variables0,
    nodes: _.map(nodes, ([id0, role0, x, y, payload, handlePositions0]) => {
      const id = id0.toString();
      const role = revAlias[role0] as Role;
      const position = { x, y };
      const handles = getRoleHandles(role);
      const undef = handlePositions0 === undefined; // For compatibility with old data
      const handlePositions = _.fromPairs(
        _.map(handles, ({ id, position }, i) => [
          id,
          undef ? position : handlePositions0[i],
        ]),
      );
      return { id, role, position, payload, handlePositions };
    }),
    edges: _.map(edges, ([source, sourceHandle, target]) => ({
      source: source.toString(),
      sourceHandle: revAlias[sourceHandle],
      target: target.toString(),
    })),
  };
}

export const serialize = _.flow(simplify, minify, JSON.stringify, compress);
export const deserialize = _.flow(decompress, JSON.parse, expand);
