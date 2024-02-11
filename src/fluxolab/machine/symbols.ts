import _ from 'lodash'

import { Symbol } from 'machine/types'
import { getVariableType } from 'machine/variables'
import evaluate from 'machine/evaluator'

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
      try {
        const variable = _.find(machine.variables, { id: variableId })
        if (variable === undefined) {
          state.errorMessage = `Variável "${variableId}" não existe.`
          state.status = 'error'
          return
        }
        const value = evaluate(expression, state.memory)
        const valueType = typeof value
        const varType = getVariableType(variable.type)
        if (valueType !== varType.jsName) {
          state.errorMessage = `Expressão \`${expression}\` não é do tipo '${varType.jsName}'.`
          state.status = 'error'
          return
        }
        state.memory[variableId] = value
        state.curSymbolId = nextId
      } catch (e) {
        state.errorMessage = e.message
        state.status = 'error'
      }
    }
  }
}

export function newConditionalSymbol (params: { id: string, condition: string, nextTrue: string, nextFalse: string }): Symbol {
  const { id, condition, nextTrue, nextFalse } = params
  return {
    id,
    type: 'conditional',
    work: (_machine, state) => {
      try {
        const conditionResult = evaluate(condition, state.memory)
        if (typeof conditionResult !== 'boolean') {
          state.errorMessage = 'A condição deve retornar um valor booleano.'
          state.status = 'error'
          return
        }
        state.curSymbolId = conditionResult ? nextTrue : nextFalse
      } catch (e) {
        state.errorMessage = e.message
        state.status = 'error'
      }
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
        state.errorMessage = 'Bloco esperava entrada, mas nenhuma foi fornecida.'
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
      if (!varType.stringIsValid(state.input)) {
        state.errorMessage = `Entrada "${state.input}" é inválida para o tipo "${variable.type}".`
        state.status = 'error'
        return
      }
      state.memory[variableId] = varType.stringToValue(state.input)
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
      try {
        const expressionResult = evaluate(expression, state.memory)
        state.interaction.push({ direction: 'out', text: `${expressionResult as string}` })
        state.curSymbolId = nextId
      } catch (e) {
        state.errorMessage = e.message
        state.status = 'error'
      }
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
