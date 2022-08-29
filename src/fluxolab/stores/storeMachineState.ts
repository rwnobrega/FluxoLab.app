import _ from 'lodash'

import create from 'zustand'

import { MachineState } from 'machine/types'

interface StoreMachineState {
  state: MachineState
  setState: (state: MachineState) => void
  stateHistory: MachineState[]
  setStateHistory: (stateHistory: MachineState[]) => void
  // Maybe not a good place for this, but...
  isRunning: boolean
}

const useStoreMachineState = create<StoreMachineState>(
  (set, get) => ({
    state: {
      curSymbolId: '',
      timeSlot: 0,
      memory: {},
      input: null,
      interaction: [],
      errorMessage: null,
      status: 'ready'
    },
    setState: state => {
      set({ state: _.cloneDeep(state) })
    },
    stateHistory: [],
    setStateHistory: stateHistory => {
      set({ stateHistory: _.cloneDeep(stateHistory) })
    },
    isRunning: false
  })
)

export default useStoreMachineState
