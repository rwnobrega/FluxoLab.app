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

function getOutgoingNode (nodeId: string, handleId: string, edges: Edge[]): string | null {
  for (const edge of edges) {
    if (edge.source === nodeId && edge.sourceHandle === handleId) {
      return edge.target
    }
  }
  return null
}

interface CompilerInput {
  nodes: Node[]
  edges: Edge[]
  variables: Variable[]
}

interface CompilerOutput {
  flowchart: Symbol[]
  startSymbolId: string
  errors: CompileError[]
}

export default function compile ({ nodes, edges, variables }: CompilerInput): CompilerOutput {
  function getStartSymbolId (): [string, CompileError[]] {
    const startNodes = _.filter(nodes, { type: 'start' })
    if (startNodes.length === 0) {
      return ['', [{ message: 'Deve haver um bloco de início.', nodeId: null }]]
    } else if (startNodes.length > 1) {
      return ['', [{ message: 'Há mais de um bloco de início.', nodeId: null }]]
    }
    return [startNodes[0].id, []]
  }

  function compileFlowchart (): [Symbol[], CompileError[]] {
    const flowchart: Symbol[] = []
    const errors: CompileError[] = []
    for (const { id, type, data } of nodes) {
      switch (type) {
        case 'start': {
          const nextId = getOutgoingNode(id, 'out', edges)
          if (nextId === null) {
            errors.push({ message: 'Bloco não tem ramo de saída.', nodeId: id })
          } else {
            flowchart.push(newStartSymbol({ id, nextId }))
          }
          break
        }
        case 'assignment': {
          const equalIndex = parseInt(data.value.indexOf('='))
          let variableId: string
          let expression: string
          if (equalIndex === -1) {
            variableId = ''
            expression = ''
            errors.push({ message: 'Atribuição inválida.', nodeId: id })
          } else {
            variableId = _.trim(data.value.slice(0, equalIndex))
            expression = _.trim(data.value.slice(equalIndex + 1))
            if (variableId === '') {
              errors.push({ message: 'Variável não especificada.', nodeId: id })
            } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variableId)) {
              errors.push({ message: `Identificador "${variableId}" inválido.`, nodeId: id })
            } else if (!_.some(variables, { id: variableId })) {
              errors.push({ message: `Variável "${variableId}" não existe.`, nodeId: id })
            }
            if (expression === '') {
              errors.push({ message: 'Expressão não especificada.', nodeId: id })
            }
          }
          const nextId = getOutgoingNode(id, 'out', edges)
          if (nextId === null) {
            errors.push({ message: 'Bloco não tem ramo de saída.', nodeId: id })
          } else {
            flowchart.push(newAssignmentSymbol({ id, variableId, expression, nextId }))
          }
          break
        }
        case 'conditional': {
          const condition = data.value
          if (condition === '') {
            errors.push({ message: 'Condição não especificada.', nodeId: id })
          }
          const nextTrue = getOutgoingNode(id, 'true', edges)
          if (nextTrue === null) {
            errors.push({ message: 'Bloco não tem ramo de saída (T).', nodeId: id })
          }
          const nextFalse = getOutgoingNode(id, 'false', edges)
          if (nextFalse === null) {
            errors.push({ message: 'Bloco não tem ramo de saída (F).', nodeId: id })
          }
          if (nextTrue !== null && nextFalse !== null) {
            flowchart.push(newConditionalSymbol({ id, condition, nextTrue, nextFalse }))
          }
          break
        }
        case 'input_': {
          const variableId: string = data.value
          if (variableId === '') {
            errors.push({ message: 'Variável não especificada.', nodeId: id })
          } else if (!_.some(variables, { id: variableId })) {
            errors.push({ message: `Variável "${variableId}" não existe.`, nodeId: id })
          }
          const nextId = getOutgoingNode(id, 'out', edges)
          if (nextId === null) {
            errors.push({ message: 'Bloco não tem ramo de saída.', nodeId: id })
          } else {
            flowchart.push(newInputSymbol({ id, variableId, nextId }))
          }
          break
        }
        case 'output_': {
          const expression = data.value
          if (expression === '') {
            errors.push({ message: 'Expressão não especificada.', nodeId: id })
          }
          const nextId = getOutgoingNode(id, 'out', edges)
          if (nextId === null) {
            errors.push({ message: 'Bloco não tem ramo de saída.', nodeId: id })
          } else {
            flowchart.push(newOutputSymbol({ id, expression, nextId }))
          }
          break
        }
        case 'end': {
          flowchart.push(newHaltSymbol({ id }))
          break
        }
        default: {
          errors.push({ message: `Tipo de nó desconhecido: ${type as string}`, nodeId: id })
          break
        }
      }
    }
    return [flowchart, errors]
  }

  const errors: CompileError[] = []

  const [startSymbolId, errs1] = getStartSymbolId()
  errors.push(...errs1)

  const [flowchart, errs2] = compileFlowchart()
  errors.push(...errs2)

  return { flowchart, startSymbolId, errors }
}
