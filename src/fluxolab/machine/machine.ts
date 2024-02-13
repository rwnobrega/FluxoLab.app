import _ from 'lodash'

import { Symbol, Machine, MachineState, Memory, Variable } from 'machine/types'

function getSymbolById (flowchart: Symbol[], id: string): Symbol {
  const symbol = _.find(flowchart, { id })
  if (symbol === undefined) {
    throw new Error(`Symbol with id "${id}" not found`)
  }
  return symbol
}

export function runMachineStep (machine: Machine, state: MachineState): void {
  if (state.curSymbolId === null) {
    state.curSymbolId = machine.startSymbolId
  }
  const symbol = getSymbolById(machine.flowchart, state.curSymbolId)
  symbol.work(machine, state)
  const nextSymbol = getSymbolById(machine.flowchart, state.curSymbolId)
  if (nextSymbol.type === 'halt') {
    state.status = 'halted'
    return
  }
  if (nextSymbol.type === 'input' && state.status !== 'error') {
    state.status = 'waiting'
  }
  state.timeSlot += 1
}

function getInitialMemory (variables: Variable[]): Memory {
  const memory: Memory = {}
  for (const variable of variables) {
    memory[variable.id] = null
  }
  return memory
}

export function getInitialState (variables: Variable[]): MachineState {
  return {
    curSymbolId: null,
    timeSlot: -1,
    memory: getInitialMemory(variables),
    input: null,
    interaction: [],
    errorMessage: null,
    status: 'ready'
  }
}
