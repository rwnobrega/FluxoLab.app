import _ from 'lodash'

import { Symbol, Machine, MachineState } from 'machine/types'

function getSymbolById (flowchart: Symbol[], id: string): Symbol {
  const symbol = _.find(flowchart, { id })
  if (symbol === undefined) {
    throw new Error(`Symbol with id "${id}" not found`)
  }
  return symbol
}

export function runMachineStep (machine: Machine, state: MachineState): void {
  const symbol = getSymbolById(machine.flowchart, state.curSymbolId)
  symbol.work(machine, state)
  const nextSymbol = getSymbolById(machine.flowchart, state.curSymbolId)
  if (nextSymbol.type === 'halt') {
    state.status = 'halted'
  } else {
    state.timeSlot += 1
  }
}

export function resetMachineState (state: MachineState, machine: Machine, startInput: string[]): void {
  state.curSymbolId = machine.startSymbolId
  state.timeSlot = 0
  state.memory = {}
  state.input = startInput
  state.interaction = []
  state.errorMessage = null
  state.status = 'ready'
}
