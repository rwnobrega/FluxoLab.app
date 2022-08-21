import { MachineState, CompileError } from 'machine/types'

interface PlayButton {
  id: string
  tooltipText: string
  icon: string
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
  return state.status === 'waiting' || state.status === 'error' || state.status === 'halted'
}

const buttonList: PlayButton[] = [
  {
    id: 'reset',
    tooltipText: 'Reiniciar',
    icon: 'bi-skip-backward-fill',
    isDisabled: isDisabledBackward
  },
  {
    id: 'stepBack',
    tooltipText: 'Voltar um passo',
    icon: 'bi-skip-start-fill',
    isDisabled: isDisabledBackward
  },
  {
    id: 'nextStep',
    tooltipText: 'Executar próximo passo',
    icon: 'bi-skip-end-fill',
    isDisabled: isDisabledForward
  },
  {
    id: 'runAuto',
    tooltipText: 'Executar automaticamente',
    icon: 'bi-fast-forward-fill',
    isDisabled: isDisabledForward
  }
]

export default buttonList
