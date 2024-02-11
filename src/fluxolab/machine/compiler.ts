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
      switch (type) {
        case 'start': {
          const nextId = getOutgoingNode(id, 'out', edges)
          flowchart.push(newStartSymbol({ id, nextId }))
          break
        }
        case 'assignment': {
          const split: string[] = _.map(data.value.split('='), _.trim)
          if (split.length !== 2) {
            throw new CompileError('Expressão inválida', [id])
          }
          const [variableId, expression] = split
          if (variableId === '') {
            throw new CompileError('Variável não especificada.', [id])
          }
          if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variableId)) {
            throw new CompileError(`Identificador "${variableId}" inválido.`, [id])
          }
          if (!_.some(variables, { id: variableId })) {
            throw new CompileError(`Variável "${variableId}" não existe.`, [id])
          }
          const nextId = getOutgoingNode(id, 'out', edges)
          flowchart.push(newAssignmentSymbol({ id, variableId, expression, nextId }))
          break
        }
        case 'conditional': {
          const condition = data.value
          const nextTrue = getOutgoingNode(id, 'true', edges)
          const nextFalse = getOutgoingNode(id, 'false', edges)
          flowchart.push(newConditionalSymbol({ id, condition, nextTrue, nextFalse }))
          break
        }
        case 'input_': {
          const variableId: string = data.value
          if (variableId === '') {
            throw new CompileError('Variável não especificada.', [id])
          }
          if (!_.some(variables, { id: variableId })) {
            throw new CompileError(`Variável "${variableId}" não existe.`, [id])
          }
          const nextId = getOutgoingNode(id, 'out', edges)
          flowchart.push(newInputSymbol({ id, variableId, nextId }))
          break
        }
        case 'output_': {
          const expression = data.value
          const nextId = getOutgoingNode(id, 'out', edges)
          flowchart.push(newOutputSymbol({ id, expression, nextId }))
          break
        }
        case 'end': {
          flowchart.push(newHaltSymbol({ id }))
          break
        }
        default: {
          throw new CompileError(`Tipo de nó desconhecido: ${type as string}`, [id])
        }
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
