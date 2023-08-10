import { Symbol } from 'machine/types'
import _ from 'lodash'

import evaluate from 'machine/parser'
import { getVariableType } from 'machine/variables'

export function newStartSymbol (params: { id: string, nextId: string }): Symbol {
  const { id, nextId } = params
  return {
    id,
    type: 'start',
    work: (_machine, state) => {
      state.curSymbolId = nextId
    }
  }
}

export function newAssignmentSymbol (params: { id: string, variableId: string, expression: string, nextId: string }): Symbol {
  const { id, variableId, expression, nextId } = params
  return {
    id,
    type: 'assignment',
    work: (machine, state) => {
      const textValue: string = evaluate(expression, state.memory)
      const variable = _.find(machine.variables, { id: variableId })
      if (variable === undefined) {
        state.errorMessage = `Variável "${variableId}" não existe.`
        state.status = 'error'
        return
      }
      const varType = getVariableType(variable.type)
      const value = varType.parse(textValue)
      state.memory[variableId] = value
      state.curSymbolId = nextId
    }
  }
}

export function newConditionalSymbol (params: { id: string, condition: string, nextTrue: string, nextFalse: string }): Symbol {
  const { id, condition, nextTrue, nextFalse } = params
  return {
    id,
    type: 'conditional',
    work: (_machine, state) => {
      const conditionResult = Boolean(evaluate(condition, state.memory))
      state.curSymbolId = conditionResult ? nextTrue : nextFalse
    }
  }
}

export function newInputSymbol (params: { id: string, variableId: string, nextId: string }): Symbol {
  const { id, variableId, nextId } = params
  return {
    id,
    type: 'input',
    work: (machine, state) => {
      if (state.input === null) {
        state.errorMessage = 'Nodo esperava entrada, mas nenhuma foi fornecida.'
        state.status = 'error'
        return
      }
      const variable = _.find(machine.variables, { id: variableId })
      if (variable === undefined) {
        state.errorMessage = `Variável "${variableId}" não existe.`
        state.status = 'error'
        return
      }
      const varType = getVariableType(variable.type)
      const value = varType.parse(state.input)
      state.memory[variableId] = value
      state.interaction.push({ direction: 'in', text: state.input })
      state.input = null
      state.status = 'ready'
      state.curSymbolId = nextId
    }
  }
}

export function newOutputSymbol (params: { id: string, expression: string, nextId: string }): Symbol {
  const { id, expression, nextId } = params
  return {
    id,
    type: 'output',
    work: (_machine, state) => {
      let expressionResult: string = expression
      for (const [variableId, variableValue] of _.toPairs(state.memory)) {
        const variable = _.find(_machine.variables, { id: variableId })
        if (variable === undefined) {
          state.errorMessage = `Variável "${variableId}" não existe.`
          state.status = 'error'
          return
        }
        if (variableValue === null) {
          state.errorMessage = `Variável "${variableId}" não inicializada.`
          state.status = 'error'
          return
        }
        const varType = getVariableType(variable.type)
        expressionResult = expressionResult.replace(`{${variableId}}`, varType.format(variableValue))
      }
      state.interaction.push({ direction: 'out', text: expressionResult })
      state.curSymbolId = nextId
    }
  }
}

export function newHaltSymbol (params: { id: string }): Symbol {
  const { id } = params
  return {
    id,
    type: 'halt',
    work: () => {
      throw new Error('Machine is halted')
    }
  }
}
