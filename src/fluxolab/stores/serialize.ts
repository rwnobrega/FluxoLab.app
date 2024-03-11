import _ from 'lodash'

import lzString from 'lz-string'

export function deserialize (lzs: string): any {
  return JSON.parse(lzString.decompressFromEncodedURIComponent(lzs))
}

export function serialize ({ machine, nodes, edges }: any): string {
  const nodes0 = _.map(nodes, node => _.pick(node, ['id', 'type', 'position', 'data']))
  const edges0 = _.map(edges, edge => _.pick(edge, ['source', 'sourceHandle', 'target', 'targetHandle']))
  const state = {
    title: machine.title,
    variables: machine.variables,
    nodes: nodes0,
    edges: edges0
  }
  return lzString.compressToEncodedURIComponent(JSON.stringify(state))
}
