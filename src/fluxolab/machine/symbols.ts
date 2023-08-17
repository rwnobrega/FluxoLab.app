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
        const value = evaluate(expression, state.memory)
        state.memory[variableId] = value
        state.curSymbolId = nextId
      } catch (e) {
        state.errorMessage = e.message
        state.status = 'error'
        return
      }
      const variable = _.find(machine.variables, { id: variableId })
      if (variable === undefined) {
        state.errorMessage = `Variável "${variableId}" não existe.`
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
      let expressionResult: string = expression
      const variables = expression.match(/{[a-zA-Z0-9]+}/g)
      if (variables !== null) {
        for (const variable of variables) {
          const variableId = variable.substring(1, variable.length - 1)
          if (state.memory[variableId] === undefined) {
            state.errorMessage = `Variável "${variableId}" não existe.`
            state.status = 'error'
            return
          }
          const variableValue = state.memory[variableId]
          if (variableValue === null) {
            state.errorMessage = `Variável "${variableId}" não inicializada.`
            state.status = 'error'
            return
          }
          expressionResult = expressionResult.replace(variable, variableValue.toString())
        }
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
