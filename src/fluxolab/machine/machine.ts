import _ from 'lodash'

import { Symbol, Machine, MachineState, Memory, Variable } from 'machine/types'

export function runMachineStep (machine: Machine, state: MachineState): void {
  if (state.curSymbolId === null) {
    state.curSymbolId = machine.startSymbolId
  }
  const symbol = _.find(machine.flowchart, { id: state.curSymbolId }) as Symbol
  symbol.work(machine, state)
  const nextSymbol = _.find(machine.flowchart, { id: state.curSymbolId }) as Symbol
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
