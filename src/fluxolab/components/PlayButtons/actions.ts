import _ from 'lodash'

import { runMachineStep, resetMachineState } from 'machine/machine'

import { Machine, MachineState } from 'machine/types'

interface ActionProps {
  machine: Machine
  state: MachineState
  setState: (state: MachineState) => void
  stateHistory: MachineState[]
  setStateHistory: (stateHistory: MachineState[]) => void
}

export default function (action: string, { machine, state, setState, stateHistory, setStateHistory }: ActionProps): void {
  if (action === 'reset') {
    resetMachineState(state)
    setStateHistory([])
    setState(state)
  } else if (action === 'stepBack') {
    const previousState = stateHistory.pop()
    if (previousState !== undefined) {
      setStateHistory(stateHistory)
      setState(previousState)
    }
  } else if (action === 'nextStep') {
    stateHistory.push(state)
    setStateHistory(stateHistory)
    runMachineStep(machine, state)
    setState(state)
  } else if (action === 'runAuto') {
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
}
