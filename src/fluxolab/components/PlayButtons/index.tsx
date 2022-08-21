import _ from 'lodash'

import React, { useCallback } from 'react'

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import Tooltip from 'components/Tooltip'

import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

import { resetMachineState, runMachineStep } from 'machine/machine'

import buttonList from './buttonList'

export default function (): JSX.Element {
  const { machine, compileError, startInputText } = useStoreMachine()
  const { state, setState, stateHistory, setStateHistory } = useStoreMachineState()

  const onClick = useCallback(
    (id: string): void => {
      if (id === 'reset') {
        resetMachineState(state, machine)
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
    <ButtonGroup>
      {_.map(buttonList, ({ id, tooltipText, icon, isDisabled }) => (
        <Tooltip key={id} text={isDisabled(state, compileError) ? '' : tooltipText}>
          <Button disabled={isDisabled(state, compileError)} onClick={() => onClick(id)}>
            <i className={`bi ${icon}`} />
          </Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  )
}
