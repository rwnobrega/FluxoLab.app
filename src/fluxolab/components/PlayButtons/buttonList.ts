import { MachineState, CompileError } from 'machine/types'
import { Action } from './actions'

interface PlayButton {
  action: Action
  description: string
  icon: string
  hotkey: string
  variant: (state: MachineState, compileError: CompileError | null) => string
  isDisabled: (state: MachineState, compileError: CompileError | null) => boolean
}

function isDisabledBackward (state: MachineState, compileError: CompileError | null): boolean {
  if (compileError !== null) {
    return true
  }
  return state.status === 'ready' && state.timeSlot === 0
}

function isDisabledForward (state: MachineState, compileError: CompileError | null): boolean {
  if (compileError !== null) {
    return true
  }
  return state.status === 'error' || state.status === 'halted'
}

const buttonList: PlayButton[] = [
  {
    action: 'reset',
    description: 'Reiniciar',
    icon: 'bi-skip-backward-fill',
    hotkey: 'ctrl+F7',
    variant: () => 'primary',
    isDisabled: isDisabledBackward
  },
  {
    action: 'stepBack',
    description: 'Voltar um passo',
    icon: 'bi-skip-start-fill',
    hotkey: 'F7',
    variant: () => 'primary',
    isDisabled: isDisabledBackward
  },
  {
    action: 'nextStep',
    description: 'Executar próximo passo',
    icon: 'bi-skip-end-fill',
    hotkey: 'F8',
    variant: (state) => state.status === 'ready' ? 'primary' : 'secondary',
    isDisabled: isDisabledForward
  },
  {
    action: 'runAuto',
    description: 'Executar automaticamente',
    icon: 'bi-fast-forward-fill',
    hotkey: 'ctrl+F8',
    variant: (state) => state.status === 'ready' ? 'primary' : 'secondary',
    isDisabled: isDisabledForward
  }
]

export default buttonList
