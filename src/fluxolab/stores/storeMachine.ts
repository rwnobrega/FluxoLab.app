import _ from 'lodash'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Variable, Symbol, CompileError, Machine } from 'machine/types'

interface StoreMachine {
  machine: Machine
  setFlowchart: (flowchart: Symbol[]) => void
  setStartSymbolId: (startSymbolId: string) => void
  getVariable: (variableId: string) => Variable | undefined
  addVariable: (id: string, type: Variable['type']) => void
  clearVariables: () => void
  removeVariable: (id: string) => void
  renameVariable: (id: string, newId: string) => void
  changeVariableType: (id: string, type: Variable['type']) => void
  compileError: CompileError | null
  setCompileError: (compileError: CompileError | null) => void
  flowchartTitle: string
  setFlowchartTitle: (flowchartTitle: string) => void
}

const useStoreMachine = create<StoreMachine, any>(
  persist(
    (set, get) => ({
      machine: {
        flowchart: [],
        startSymbolId: '',
        variables: []
      },
      setFlowchart: flowchart => {
        const { machine } = get()
        machine.flowchart = flowchart
        set({ machine })
      },
      setStartSymbolId: startSymbolId => {
        const { machine } = get()
        machine.startSymbolId = startSymbolId
        set({ machine })
      },
      getVariable: id => {
        const { machine } = get()
        return _.find(machine.variables, { id })
      },
      addVariable: (id, type) => {
        const { machine } = get()
        machine.variables = _.concat(machine.variables, { id, type })
        set({ machine })
      },
      clearVariables: () => {
        const { machine } = get()
        machine.variables = []
        set({ machine })
      },
      removeVariable: id => {
        const { machine } = get()
        machine.variables = _.reject(machine.variables, { id })
        set({ machine })
      },
      renameVariable: (id, newId) => {
        const { machine } = get()
        machine.variables = _.map(machine.variables, variable => {
          if (variable.id === id) {
            variable.id = newId
          }
          return variable
        })
        set({ machine })
      },
      changeVariableType: (id, type) => {
        const { machine } = get()
        machine.variables = _.map(machine.variables, variable => {
          if (variable.id === id) {
            variable.type = type
          }
          return variable
        })
        set({ machine })
      },
      compileError: null,
      setCompileError: compileError => { set({ compileError }) },
      flowchartTitle: 'Fluxograma sem título',
      setFlowchartTitle: flowchartTitle => { set({ flowchartTitle }) }
    }),
    {
      name: 'fluxolab_machine',
      version: 1
    }
  )
)

export default useStoreMachine
