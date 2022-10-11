import _ from 'lodash'

import create from 'zustand'

import { Machine, MachineState } from 'machine/types'
import { runMachineStep, getInitialState } from 'machine/machine'

export type Action = 'reset' | 'stepBack' | 'nextStep' | 'runAuto'

interface StoreMachineState {
  stateHistory: MachineState[]
  isRunning: boolean
  getState: () => MachineState
  reset: () => void
  stepBack: () => void
  nextStep: (machine: Machine, refInput: React.RefObject<HTMLInputElement>) => void
  runAuto: (machine: Machine, refInput: React.RefObject<HTMLInputElement>) => void
  execAction: (action: Action, machine: Machine, refInput: React.RefObject<HTMLInputElement>) => void
}

const useStoreMachineState = create<StoreMachineState>(
  (set, get) => ({
    stateHistory: [getInitialState()],
    isRunning: false,
    getState: () => {
      const stateHistory = get().stateHistory
      return stateHistory[stateHistory.length - 1]
    },
    reset: () => {
      set({ stateHistory: [getInitialState()] })
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
    runAuto: (machine, refInput) => {
      const stateHistory = get().stateHistory
      if (get().getState().status === 'waiting') {
        refInput.current?.focus()
        return
      }
      set({ isRunning: !get().isRunning })
      const runAuto = async (): Promise<void> => {
        while (get().isRunning && get().getState().status === 'ready') {
          const state = _.clone(stateHistory[stateHistory.length - 1])
          runMachineStep(machine, state)
          stateHistory.push(state)
          set({ stateHistory })
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        set({ isRunning: false })
      }
      runAuto().catch(error => console.log(error.message))
    },
    execAction: (action, machine, refInput) => {
      switch (action) {
        case 'reset':
          get().reset()
          break
        case 'stepBack':
          get().stepBack()
          break
        case 'nextStep':
          get().nextStep(machine, refInput)
          break
        case 'runAuto':
          get().runAuto(machine, refInput)
          break
      }
    }
  })
)

export default useStoreMachineState
