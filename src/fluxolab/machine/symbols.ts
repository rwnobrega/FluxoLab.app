import _ from 'lodash'

import evaluate, { registerFunction } from 'ts-expression-evaluator'

import { Symbol } from 'machine/types'

import { getVariableType } from 'machine/variables'

registerFunction('div', (a: any, b: any) => Math.round(a / b))
registerFunction('mod', (a: any, b: any) => a % b)
registerFunction('pow', (a: any, b: any) => Math.pow(a, b))
registerFunction('sqrt', (a: any) => Math.sqrt(a))
registerFunction('log', (a: any) => Math.log(a))
registerFunction('log10', (a: any) => Math.log10(a))
registerFunction('log2', (a: any) => Math.log2(a))
registerFunction('exp', (a: any) => Math.exp(a))
registerFunction('sin', (a: any) => Math.sin(a))
registerFunction('cos', (a: any) => Math.cos(a))
registerFunction('tan', (a: any) => Math.tan(a))
registerFunction('asin', (a: any) => Math.asin(a))
registerFunction('acos', (a: any) => Math.acos(a))
registerFunction('atan', (a: any) => Math.atan(a))
registerFunction('sinh', (a: any) => Math.sinh(a))
registerFunction('cosh', (a: any) => Math.cosh(a))
registerFunction('tanh', (a: any) => Math.tanh(a))
registerFunction('asinh', (a: any) => Math.asinh(a))
registerFunction('acosh', (a: any) => Math.acosh(a))
registerFunction('atanh', (a: any) => Math.atanh(a))
registerFunction('sign', (a: any) => Math.sign(a))
registerFunction('abs', (a: any) => Math.abs(a))
registerFunction('round', (a: any) => Math.round(a))
registerFunction('floor', (a: any) => Math.floor(a))
registerFunction('ceil', (a: any) => Math.ceil(a))
registerFunction('min', (a: any, b: any) => Math.min(a, b))
registerFunction('max', (a: any, b: any) => Math.max(a, b))

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
