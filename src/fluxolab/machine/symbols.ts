import _ from 'lodash'

import { Symbol, Variable } from 'machine/types'
import { getVariableType } from 'machine/variables'

import evaluate from 'language/evaluate'
import grammar from 'language/grammar'
import { syntaxErrorMessage } from 'language/errors'

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
      const variable = _.find(machine.variables, { id: variableId }) as Variable
      const matchResult = grammar.match(expression, 'Expression')
      if (matchResult.failed()) {
        state.errorMessage = syntaxErrorMessage(matchResult)
        state.status = 'error'
        return
      }
      const value = evaluate(matchResult, state.memory)
      if (value instanceof Error) {
        state.errorMessage = value.message
        state.status = 'error'
        return
      }
      if (variable.type !== typeof value as string) {
        const msg1 = `A variável \`${variableId}\` é do tipo \`${variable.type}\``
        const msg2 = `a expressão \`${expression}\` é do tipo \`${typeof value}\``
        state.errorMessage = `${msg1}, mas ${msg2}.`
        state.status = 'error'
        return
      }
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
      const matchResult = grammar.match(condition, 'Expression')
      if (matchResult.failed()) {
        state.errorMessage = syntaxErrorMessage(matchResult)
        state.status = 'error'
        return
      }
      const conditionValue = evaluate(matchResult, state.memory)
      if (conditionValue instanceof Error) {
        state.errorMessage = conditionValue.message
        state.status = 'error'
        return
      }
      if (typeof conditionValue !== 'boolean') {
        state.errorMessage = 'A condição deve retornar um valor booleano.'
        state.status = 'error'
        return
      }
      state.curSymbolId = conditionValue ? nextTrue : nextFalse
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
      const variable = _.find(machine.variables, { id: variableId }) as Variable
      const varType = getVariableType(variable.type)
      if (!varType.stringIsValid(state.input)) {
        state.errorMessage = `Entrada \`${state.input}\` é inválida para o tipo \`${variable.type}\`.`
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
      const matchResult = grammar.match(`write ${expression}`, 'Command_write')
      if (matchResult.failed()) {
        state.errorMessage = syntaxErrorMessage(matchResult)
        state.status = 'error'
        return
      }
      const value = evaluate(matchResult, state.memory) as string | Error
      if (value instanceof Error) {
        state.errorMessage = value.message
        state.status = 'error'
        return
      }
      state.interaction.push({ direction: 'out', text: value })
      state.curSymbolId = nextId
    }
  }
}

export function newHaltSymbol (params: { id: string }): Symbol {
  const { id } = params
  return {
    id,
    type: 'halt',
    work: (_machine, state) => {
      state.errorMessage = 'A máquina foi parada.'
      state.status = 'error'
    }
  }
}
