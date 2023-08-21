import { Action } from 'stores/storeMachineState'
import { MachineState, CompileError } from 'machine/types'

interface IsDisabledProps {
  state: MachineState
  compileError: CompileError | null
}

interface PlayButton {
  action: Action
  hotkey: string
  description: string
  icon: string
  isDisabled: (isDisabledProps: IsDisabledProps) => boolean
}

function isDisabledBackward (state: MachineState): boolean {
  return state.status === 'ready' && state.timeSlot === 0
}

function isDisabledForward (state: MachineState): boolean {
  return state.status === 'error' || state.status === 'halted'
}

const buttonList: PlayButton[] = [
  {
    action: 'reset',
    hotkey: 'F6',
    description: 'Encerrar execução',
    icon: 'bi-stop-fill',
    isDisabled: ({ state, compileError }) => (
      compileError !== null || isDisabledBackward(state)
    )
  },
  {
    action: 'stepBack',
    hotkey: 'F7',
    description: 'Voltar um passo',
    icon: 'bi-skip-start-fill',
    isDisabled: ({ state, compileError }) => (
      compileError !== null || isDisabledBackward(state)
    )
  },
  {
    action: 'nextStep',
    hotkey: 'F8',
    description: 'Executar próximo passo',
    icon: 'bi-skip-end-fill',
    isDisabled: ({ state, compileError }) => (
      compileError !== null || isDisabledForward(state)
    )
  }
]

export default buttonList
