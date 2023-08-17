import _ from 'lodash'

import { Node, Edge } from 'reactflow'

import { Variable, Symbol, CompileError } from 'machine/types'

import {
  newStartSymbol,
  newAssignmentSymbol,
  newConditionalSymbol,
  newHaltSymbol,
  newInputSymbol,
  newOutputSymbol
} from 'machine/symbols'

function getOutgoingNode (nodeId: string, handleId: string, edges: Edge[]): string {
  for (const edge of edges) {
    if (edge.source === nodeId && edge.sourceHandle === handleId) {
      return edge.target
    }
  }
  throw new CompileError('Bloco não tem ramo de saída.', [nodeId])
}

interface CompilerInput {
  nodes: Node[]
  edges: Edge[]
  variables: Variable[]
}

interface CompilerOutput {
  flowchart: Symbol[]
  startSymbolId: string
  error: CompileError | null
}

export default function compile ({ nodes, edges, variables }: CompilerInput): CompilerOutput {
  function getStartSymbolId (): string {
    const startNodes = _.filter(nodes, { type: 'start' })
    if (startNodes.length === 0) {
      throw new CompileError('Deve haver um bloco de início.', [])
    } else if (startNodes.length > 1) {
      throw new CompileError('Há mais de um bloco de início.', _.map(startNodes, 'id'))
    }
    return startNodes[0].id
  }

  function compileFlowchart (): Symbol[] {
    const flowchart: Symbol[] = []
    for (const { id, type, data } of nodes) {
      if (type === 'start') {
        const nextId = getOutgoingNode(id, 'out', edges)
        flowchart.push(newStartSymbol({ id, nextId }))
      } else if (type === 'assignment') {
        const split: string[] = _.map(data.value.split('='), _.trim)
        if (split.length !== 2) {
          throw new CompileError('Expressão inválida', [id])
        }
        const [variableId, expression] = split
        if (!_.some(variables, { id: variableId })) {
          throw new CompileError(`Variável "${variableId}" não existe.`, [id])
        }
        const nextId = getOutgoingNode(id, 'out', edges)
        flowchart.push(newAssignmentSymbol({ id, variableId, expression, nextId }))
      } else if (type === 'conditional') {
        const condition = data.value
        const nextTrue = getOutgoingNode(id, 'true', edges)
        const nextFalse = getOutgoingNode(id, 'false', edges)
        flowchart.push(newConditionalSymbol({ id, condition, nextTrue, nextFalse }))
      } else if (type === 'input_') {
        const variableId = data.value
        if (!_.some(variables, { id: variableId })) {
          throw new CompileError(`Variável "${variableId as string}" não existe.`, [id])
        } const nextId = getOutgoingNode(id, 'out', edges)
        flowchart.push(newInputSymbol({ id, variableId, nextId }))
      } else if (type === 'output_') {
        const expression = data.value
        const nextId = getOutgoingNode(id, 'out', edges)
        flowchart.push(newOutputSymbol({ id, expression, nextId }))
      } else if (type === 'end') {
        flowchart.push(newHaltSymbol({ id }))
      }
    }
    return flowchart
  }

  try {
    const startSymbolId = getStartSymbolId()
    const flowchart = compileFlowchart()
    return {
      flowchart,
      startSymbolId,
      error: null
    }
  } catch (error) {
    return {
      flowchart: [],
      startSymbolId: '',
      error
    }
  }
}
