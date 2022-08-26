import _ from 'lodash'

import React, { useCallback } from 'react'

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import Tooltip from 'components/Tooltip'

import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

import { resetMachineState, runMachineStep } from 'machine/machine'

import buttonList from './buttonList'

interface Props {
  refInput: React.RefObject<HTMLInputElement>
}

export default function ({ refInput }: Props): JSX.Element {
  const { machine, compileError } = useStoreMachine()
  const { state, setState, stateHistory, setStateHistory } = useStoreMachineState()

  const onClick = useCallback(
    (id: string): void => {
      if (id === 'reset') {
        resetMachineState(state)
        setStateHistory([])
        setState(state)
      } else if (id === 'stepBack') {
        const previousState = stateHistory.pop()
        if (previousState !== undefined) {
          setStateHistory(stateHistory)
          setState(previousState)
        }
      } else if (id === 'nextStep') {
        if (state.status === 'waiting') {
          refInput.current?.focus()
          return
        }
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
          if (state.status === 'waiting') {
            refInput.current?.focus()
          }
        }
        runAuto().catch(error => console.log(error.message))
      }
    },
    [machine, state, stateHistory]
  )

  return (
    <ButtonGroup>
      {_.map(buttonList, ({ id, tooltipText, icon, variant, isDisabled }) => (
        <Tooltip key={id} text={isDisabled(state, compileError) ? '' : tooltipText}>
          <Button
            variant={variant(state, compileError)}
            disabled={isDisabled(state, compileError)}
            onClick={() => onClick(id)}
          >
            <i className={`bi ${icon}`} />
          </Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  )
}
