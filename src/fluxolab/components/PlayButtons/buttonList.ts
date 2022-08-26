import { MachineState, CompileError } from 'machine/types'
import { Action } from './actions'

interface PlayButton {
  action: Action
  tooltipText: string
  icon: string
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
    tooltipText: 'Reiniciar',
    icon: 'bi-skip-backward-fill',
    variant: () => 'primary',
    isDisabled: isDisabledBackward
  },
  {
    action: 'stepBack',
    tooltipText: 'Voltar um passo',
    icon: 'bi-skip-start-fill',
    variant: () => 'primary',
    isDisabled: isDisabledBackward
  },
  {
    action: 'nextStep',
    tooltipText: 'Executar próximo passo',
    icon: 'bi-skip-end-fill',
    variant: (state) => state.status === 'ready' ? 'primary' : 'secondary',
    isDisabled: isDisabledForward
  },
  {
    action: 'runAuto',
    tooltipText: 'Executar automaticamente',
    icon: 'bi-fast-forward-fill',
    variant: (state) => state.status === 'ready' ? 'primary' : 'secondary',
    isDisabled: isDisabledForward
  }
]

export default buttonList
