import _ from 'lodash'

import { runMachineStep, resetMachineState } from 'machine/machine'

import { Machine, MachineState } from 'machine/types'

interface ActionHooks {
  machine: Machine
  state: MachineState
  setState: (state: MachineState) => void
  stateHistory: MachineState[]
  setStateHistory: (stateHistory: MachineState[]) => void
}

export type Action = 'reset' | 'stepBack' | 'nextStep' | 'runAuto'

export default function (action: Action, { machine, state, setState, stateHistory, setStateHistory }: ActionHooks): void {
  return {
    reset: () => {
      resetMachineState(state)
      setStateHistory([])
      setState(state)
    },
    stepBack: () => {
      const previousState = stateHistory.pop()
      if (previousState !== undefined) {
        setStateHistory(stateHistory)
        setState(previousState)
      }
    },
    nextStep: () => {
      stateHistory.push(state)
      setStateHistory(stateHistory)
      runMachineStep(machine, state)
      setState(state)
    },
    runAuto: () => {
      const runAuto = async (): Promise<void> => {
        while (state.status === 'ready') {
          stateHistory.push(_.cloneDeep(state))
          setStateHistory(stateHistory)
          runMachineStep(machine, state)
          setState(state)
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      runAuto().catch(error => console.log(error.message))
    }
  }[action]()
}
