import { MachineState, CompileError } from 'machine/types'
import { Action } from './actions'

interface IsDisabledProps {
  state: MachineState
  compileError: CompileError | null
  isRunning: boolean
}

interface PlayButton {
  action: Action
  hotkey: string
  description: (isRunning: boolean) => string
  icon: (isRunning: boolean) => string
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
    hotkey: 'ctrl+F7',
    description: () => 'Reiniciar',
    icon: () => 'bi-skip-backward-fill',
    isDisabled: ({ state, compileError, isRunning }) => (
      isRunning || compileError !== null || isDisabledBackward(state)
    )
  },
  {
    action: 'stepBack',
    hotkey: 'F7',
    description: () => 'Voltar um passo',
    icon: () => 'bi-skip-start-fill',
    isDisabled: ({ state, compileError, isRunning }) => (
      isRunning || compileError !== null || isDisabledBackward(state)
    )
  },
  {
    action: 'runAuto',
    hotkey: 'ctrl+F8',
    description: isRunning => isRunning ? 'Pausar' : 'Executar',
    icon: isRunning => isRunning ? 'bi-pause-fill' : 'bi-play-fill',
    isDisabled: ({ state, compileError }) => (
      compileError !== null || isDisabledForward(state)
    )
  },
  {
    action: 'nextStep',
    hotkey: 'F8',
    description: () => 'Executar próximo passo',
    icon: () => 'bi-skip-end-fill',
    isDisabled: ({ state, compileError, isRunning }) => (
      isRunning || compileError !== null || isDisabledForward(state)
    )
  }
]

export default buttonList
