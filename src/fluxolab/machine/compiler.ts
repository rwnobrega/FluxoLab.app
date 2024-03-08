import _ from 'lodash'

import { Node, Edge } from 'reactflow'

import { Variable, Symbol, CompileError } from 'machine/types'

import match from 'language/match'

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
          const assignment: string = data.value
          const matchResult = match(assignment, 'Command_assignment')
          let variableId = ''
          let expression = ''
          if (matchResult instanceof Error) {
            errors.push({ message: matchResult.message, nodeId: id })
          } else {
            // TODO: Use `matchResult` to get `variableId` and `expression`.
            const equalIndex = assignment.indexOf('=')
            variableId = _.trim(assignment.slice(0, equalIndex))
            expression = _.trim(assignment.slice(equalIndex + 1))
            // /TODO
            if (!_.some(variables, { id: variableId })) {
              errors.push({ message: `Variável \`${variableId}\` não existe.`, nodeId: id })
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
          const condition: string = data.value
          const matchResult = match(condition, 'Expression')
          if (matchResult instanceof Error) {
            errors.push({ message: matchResult.message, nodeId: id })
          }
          const nextTrue = getOutgoingNode(id, 'true', edges)
          if (nextTrue === null) {
            errors.push({ message: 'Bloco não tem ramo na saída T.', nodeId: id })
          }
          const nextFalse = getOutgoingNode(id, 'false', edges)
          if (nextFalse === null) {
            errors.push({ message: 'Bloco não tem ramo na saída F.', nodeId: id })
          }
          if (nextTrue !== null && nextFalse !== null) {
            flowchart.push(newConditionalSymbol({ id, condition, nextTrue, nextFalse }))
          }
          break
        }
        case 'input_': {
          const variableId: string = data.value
          const matchResult = match(`read ${variableId}`, 'Command_read')
          if (matchResult instanceof Error) {
            errors.push({ message: matchResult.message, nodeId: id })
          } else if (!_.some(variables, { id: variableId })) {
            errors.push({ message: `Variável \`${variableId}\` não existe.`, nodeId: id })
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
          const expression: string = data.value
          const matchResult = match(`write ${expression}`, 'Command_write')
          if (matchResult instanceof Error) {
            errors.push({ message: matchResult.message, nodeId: id })
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
