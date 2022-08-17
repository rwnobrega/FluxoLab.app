import _ from 'lodash'

import React, { useCallback } from 'react'

import Tooltip from 'components/Tooltip'

import useStoreFlow from 'stores/storeFlow'
import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

import { resetMachineState, runMachineStep } from 'machine/machine'
import { CompileError, MachineState } from 'machine/types'

interface Button {
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
  return state.status === 'error' || state.status === 'halted'
}

const buttonList: Button[] = [
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
  },
  {
    id: 'runToEnd',
    tooltipText: 'Executar até o fim',
    icon: 'bi-skip-forward-fill',
    isDisabled: isDisabledForward
  }
]

export default function (): JSX.Element {
  const { startInputText } = useStoreFlow()
  const { machine, compileError } = useStoreMachine()
  const { state, setState, stateHistory, setStateHistory } = useStoreMachineState()

  const onClick = useCallback(
    (id: string): void => {
      if (id === 'reset') {
        const startInput = startInputText === '' ? [] : startInputText.split('\n')
        resetMachineState(state, machine, startInput)
        setStateHistory([])
        setState(state)
      } else if (id === 'stepBack') {
        const previousState = stateHistory.pop()
        if (previousState !== undefined) {
          setStateHistory(stateHistory)
          setState(previousState)
        }
      } else if (id === 'nextStep') {
        stateHistory.push(state)
        setStateHistory(stateHistory)
        runMachineStep(machine, state)
        setState(state)
      } else if (id === 'runAuto') {
        const runAuto = async (): Promise<void> => {
          while (state.status === 'ready') {
            stateHistory.push(_.cloneDeep(state))
            setStateHistory(stateHistory)
            runMachineStep(machine, state)
            setState(state)
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }
        runAuto().catch(error => console.log(error.message))
      } else if (id === 'runToEnd') {
        while (state.status === 'ready') {
          stateHistory.push(_.cloneDeep(state))
          runMachineStep(machine, state)
        }
        setStateHistory(stateHistory)
        setState(state)
      }
    },
    [machine, state, stateHistory, startInputText]
  )

  return (
    <div className='btn-group' role='group'>
      {_.map(buttonList, ({ id, tooltipText, icon, isDisabled }) => (
        <Tooltip key={id} text={isDisabled(state, compileError) ? '' : tooltipText}>
          <button
            type='button'
            className='btn btn-primary'
            disabled={isDisabled(state, compileError)}
            onClick={() => onClick(id)}
          >
            <i className={`bi ${icon}`} />
          </button>
        </Tooltip>
      ))}
    </div>
  )
}
