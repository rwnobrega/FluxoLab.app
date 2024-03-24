import _ from 'lodash'

import { compressToEncodedURIComponent as compress, decompressFromEncodedURIComponent as decompress } from 'lz-string'

import { Node, Edge } from 'reactflow'

import { Machine } from 'machine/machine'
import { Variable } from 'machine/variables'

const revAlias = ['number', 'string', 'boolean', 'start', 'read', 'write', 'assignment', 'conditional', 'end', 'in', 'out', 'true', 'false']
const dirAlias = _.fromPairs(_.map(revAlias, (item, index) => [item, index]))

interface State {
  machine: Machine
  nodes: Node[]
  edges: Edge[]
}

interface SimpleNode {
  id: string
  type: string
  position: { x: number, y: number }
  data: string
}

interface SimpleEdge {
  source: string
  sourceHandle: string
  target: string
  targetHandle: string
}

interface SimplifiedState {
  title: string
  variables: Variable[]
  nodes: SimpleNode[]
  edges: SimpleEdge[]
}

type MinifiedState = [
  string, // title
  Array<[string, number]>, // variables (id, type)
  Array<[number, number, number, number, string]>, // nodes (id, type, x, y, data)
  Array<[number, number, number, number]> // edges (source, sourceHandle, target, targetHandle)
]

function simplify ({ machine, nodes, edges }: State): SimplifiedState {
  return {
    title: machine.title,
    variables: machine.variables,
    nodes: _.map(nodes, node => _.pick(node, ['id', 'type', 'position', 'data'])) as SimpleNode[],
    edges: _.map(edges, edge => _.pick(edge, ['source', 'sourceHandle', 'target', 'targetHandle'])) as SimpleEdge[]
  }
}

function minify ({ title, variables, nodes, edges }: SimplifiedState): MinifiedState {
  return [
    title,
    _.map(variables, variable => [
      variable.id,
      dirAlias[variable.type]
    ]),
    _.map(nodes, node => [
      parseInt(node.id),
      dirAlias[node.type],
      node.position.x,
      node.position.y,
      node.data
    ]),
    _.map(edges, edge => [
      parseInt(edge.source),
      dirAlias[edge.sourceHandle],
      parseInt(edge.target),
      dirAlias[edge.targetHandle]
    ])
  ]
}

function expand (minifiedState: MinifiedState): SimplifiedState {
  const [title, variables, nodes, edges] = minifiedState
  return {
    title,
    variables: _.map(variables, ([id, type]) => ({
      id,
      type: revAlias[type]
    })) as Variable[],
    nodes: _.map(nodes, ([id, type, x, y, data]) => ({
      id: id.toString(),
      type: revAlias[type],
      position: { x, y },
      data
    })),
    edges: _.map(edges, ([source, sourceHandle, target, targetHandle]) => ({
      source: source.toString(),
      sourceHandle: revAlias[sourceHandle],
      target: target.toString(),
      targetHandle: revAlias[targetHandle]
    }))
  }
}

export const serialize = _.flow(simplify, minify, JSON.stringify, compress)
export const deserialize = _.flow(decompress, JSON.parse, expand)
