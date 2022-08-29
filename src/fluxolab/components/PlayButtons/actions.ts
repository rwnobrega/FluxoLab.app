import _ from 'lodash'

import { runMachineStep, resetMachineState } from 'machine/machine'
import { Machine, MachineState } from 'machine/types'

import useStoreMachineState from 'stores/storeMachineState'

interface ActionHooks {
  machine: Machine
  state: MachineState
  setState: (state: MachineState) => void
  stateHistory: MachineState[]
  setStateHistory: (stateHistory: MachineState[]) => void
  refInput: React.RefObject<HTMLInputElement>
}

export type Action = 'reset' | 'stepBack' | 'nextStep' | 'runAuto'

export default function (action: Action, { machine, state, setState, stateHistory, setStateHistory, refInput }: ActionHooks): void {
  return {
    reset: () => {
      resetMachineState(state)
      setStateHistory([])
      setState(state)
    },
    stepBack: () => {
      if (state.curSymbolId === null) {
        return
      }
      const previousState = stateHistory.pop()
      if (previousState !== undefined) {
        setStateHistory(stateHistory)
        previousState.input = null
        setState(previousState)
      }
    },
    nextStep: () => {
      if (state.status === 'halted') {
        return
      }
      if (state.status === 'waiting' && state.input === null) {
        refInput.current?.focus()
        return
      }
      stateHistory.push(state)
      setStateHistory(stateHistory)
      runMachineStep(machine, state)
      setState(state)
    },
    runAuto: () => {
      if (state.status === 'waiting') {
        refInput.current?.focus()
        return
      }
      useStoreMachineState.setState({ isRunning: !useStoreMachineState.getState().isRunning })
      const runAuto = async (): Promise<void> => {
        while (useStoreMachineState.getState().isRunning && state.status === 'ready') {
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
