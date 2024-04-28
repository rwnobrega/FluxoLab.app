import _ from "lodash";
import {
  compressToEncodedURIComponent as compress,
  decompressFromEncodedURIComponent as decompress,
} from "lz-string";

import { Flowchart } from "./useStoreFlowchart";

const revAlias = [
  "number",
  "string",
  "boolean",
  "start",
  "read",
  "write",
  "assignment",
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
  type: string;
  position: { x: number; y: number };
  data: string;
}

interface SimpleEdge {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string; // TODO: This is not needed
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
  Array<[number, number, number, number, string]>, // nodes (id, type, x, y, data)
  Array<[number, number, number, number]>, // edges (source, sourceHandle, target, targetHandle)
];

function simplify(flowchart: Flowchart): SimpleFlowchart {
  const { title, variables, nodes, edges } = flowchart;
  return {
    title,
    variables,
    nodes: _.map(nodes, (node) =>
      _.pick(node, ["id", "type", "position", "data"]),
    ) as SimpleNode[],
    edges: _.map(edges, (edge) =>
      _.pick(edge, ["source", "sourceHandle", "target", "targetHandle"]),
    ) as SimpleEdge[],
  };
}

function minify(simpleFlowchart: SimpleFlowchart): MiniFlowchart {
  const { title, variables, nodes, edges } = simpleFlowchart;
  return [
    title,
    _.map(variables, (variable) => [variable.id, dirAlias[variable.type]]),
    _.map(nodes, (node) => [
      parseInt(node.id),
      dirAlias[node.type],
      node.position.x,
      node.position.y,
      node.data,
    ]),
    _.map(edges, (edge) => [
      parseInt(edge.source),
      dirAlias[edge.sourceHandle],
      parseInt(edge.target),
      dirAlias[edge.targetHandle],
    ]),
  ];
}

function expand(miniFlowchart: MiniFlowchart): SimpleFlowchart {
  const [title, variables, nodes, edges] = miniFlowchart;
  return {
    title,
    variables: _.map(variables, ([id, type]) => ({
      id,
      type: revAlias[type],
    })) as Flowchart["variables"],
    nodes: _.map(nodes, ([id, type, x, y, data]) => ({
      id: id.toString(),
      type: revAlias[type],
      position: { x, y },
      data,
    })),
    edges: _.map(edges, ([source, sourceHandle, target, targetHandle]) => ({
      source: source.toString(),
      sourceHandle: revAlias[sourceHandle],
      target: target.toString(),
      targetHandle: revAlias[targetHandle],
    })),
  };
}

export const serialize = _.flow(simplify, minify, JSON.stringify, compress);
export const deserialize = _.flow(decompress, JSON.parse, expand);
