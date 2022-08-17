import _ from 'lodash'

import create from 'zustand'

import { MachineState } from 'machine/types'

interface StoreMachineState {
  state: MachineState
  setState: (state: MachineState) => void
  stateHistory: MachineState[]
  setStateHistory: (stateHistory: MachineState[]) => void
}

const useStoreMachineState = create<StoreMachineState>(
  (set, get) => ({
    state: {
      curSymbolId: '',
      timeSlot: 0,
      memory: {},
      input: [],
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
    }
  })
)

export default useStoreMachineState
