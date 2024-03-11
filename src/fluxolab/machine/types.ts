export interface Variable {
  id: string
  type: 'number' | 'boolean' | 'string'
}

export type VarType = number | boolean | string

export interface Symbol {
  id: string
  type: 'start' | 'assignment' | 'conditional' | 'input' | 'output' | 'halt'
  work: (machine: Machine, state: MachineState) => void
}

export interface CompileError {
  message: string
  nodeId: string | null
}

export interface Machine {
  title: string
  flowchart: Symbol[]
  startSymbolId: string
  variables: Variable[]
}

export interface InteractionAtom {
  direction: 'in' | 'out'
  text: string
}

export interface Memory {
  [key: string]: VarType | null
}

export interface MachineState {
  curSymbolId: string | null
  timeSlot: number
  memory: Memory
  input: string | null
  interaction: InteractionAtom[]
  status: 'ready' | 'waiting' | 'halted' | 'error'
  errorMessage: string | null
}
