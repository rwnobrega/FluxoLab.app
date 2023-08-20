import _ from 'lodash'

import { create } from 'zustand'

import { Machine, MachineState } from 'machine/types'
import { runMachineStep, getInitialState } from 'machine/machine'

export type Action = 'reset' | 'stepBack' | 'nextStep'

interface StoreMachineState {
  stateHistory: MachineState[]
  getState: () => MachineState
  reset: (machine: Machine) => void
  stepBack: () => void
  nextStep: (machine: Machine, refInput: React.RefObject<HTMLInputElement>) => void
  execAction: (action: Action, machine: Machine, refInput: React.RefObject<HTMLInputElement>) => void
}

const useStoreMachineState = create<StoreMachineState>(
  (set, get) => ({
    stateHistory: [getInitialState([])],
    getState: () => {
      const stateHistory = get().stateHistory
      return stateHistory[stateHistory.length - 1]
    },
    reset: machine => {
      const stateHistory = [getInitialState(machine.variables)]
      set({ stateHistory })
    },
    stepBack: () => {
      const stateHistory = get().stateHistory
      if (stateHistory.length <= 1) {
        return
      }
      stateHistory.pop()
      stateHistory[stateHistory.length - 1].input = null
      set({ stateHistory })
    },
    nextStep: (machine, refInput) => {
      const stateHistory = get().stateHistory
      const state = _.cloneDeep(stateHistory[stateHistory.length - 1])
      if (state.status === 'halted') {
        return
      }
      if (state.status === 'waiting' && state.input === null) {
        refInput.current?.focus()
        return
      }
      runMachineStep(machine, state)
      stateHistory.push(state)
      set({ stateHistory })
    },
    execAction: (action, machine, refInput) => {
      switch (action) {
        case 'reset':
          get().reset(machine)
          break
        case 'stepBack':
          get().stepBack()
          break
        case 'nextStep':
          get().nextStep(machine, refInput)
          break
      }
    }
  })
)

export default useStoreMachineState
