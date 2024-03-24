import _ from 'lodash'

import { VarType, Variable } from './variables'
import { Symbol } from './symbols'

export interface Machine {
  title: string
  flowchart: Symbol[]
  startSymbolId: string
  variables: Variable[]
}

export interface MachineState {
  curSymbolId: string | null
  timeSlot: number
  memory: Record<string, VarType | null>
  input: string | null
  interaction: Array<{ direction: 'in' | 'out', text: string }>
  status: 'ready' | 'waiting' | 'halted' | 'error'
  errorMessage: string | null
}

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

export function getInitialState (variables: Variable[]): MachineState {
  return {
    curSymbolId: null,
    timeSlot: -1,
    memory: _.fromPairs(variables.map(variable => [variable.id, null])),
    input: null,
    interaction: [],
    errorMessage: null,
    status: 'ready'
  }
}
