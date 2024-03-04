import { Action } from 'stores/storeMachineState'
import { MachineState, CompileError } from 'machine/types'

interface IsDisabledProps {
  state: MachineState
  compileErrors: CompileError[]
}

interface PlayButton {
  action: Action
  hotkey: string
  description: string
  icon: string
  isDisabled: (isDisabledProps: IsDisabledProps) => boolean
}

function isDisabledBackward (state: MachineState): boolean {
  return state.status === 'ready' && state.timeSlot === -1
}

function isDisabledForward (state: MachineState): boolean {
  return state.status === 'error' || state.status === 'halted'
}

const buttonList: PlayButton[] = [
  {
    action: 'reset',
    hotkey: 'ESC',
    description: 'Encerrar execução',
    icon: 'bi-stop-fill',
    isDisabled: ({ state, compileErrors }) => (
      compileErrors.length > 0 || isDisabledBackward(state)
    )
  },
  {
    action: 'stepBack',
    hotkey: 'F7',
    description: 'Voltar um passo',
    icon: 'bi-skip-start-fill',
    isDisabled: ({ state, compileErrors }) => (
      compileErrors.length > 0 || isDisabledBackward(state)
    )
  },
  {
    action: 'nextStep',
    hotkey: 'F8',
    description: 'Executar próximo passo',
    icon: 'bi-skip-end-fill',
    isDisabled: ({ state, compileErrors }) => (
      compileErrors.length > 0 || isDisabledForward(state)
    )
  }
]

export default buttonList
