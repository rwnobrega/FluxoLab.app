import _ from 'lodash'

import React, { useCallback } from 'react'

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import Tooltip from 'components/Tooltip'

import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

import execAction, { Action } from './actions'
import buttonList from './buttonList'

interface Props {
  refInput: React.RefObject<HTMLInputElement>
}

export default function ({ refInput }: Props): JSX.Element {
  const { machine, compileError } = useStoreMachine()
  const { state, setState, stateHistory, setStateHistory } = useStoreMachineState()

  const onClick = useCallback(
    (action: Action) => {
      const actionHooks = { machine, state, setState, stateHistory, setStateHistory, refInput }
      execAction(action, actionHooks)
    }, [machine, state, stateHistory]
  )

  return (
    <ButtonGroup>
      {_.map(buttonList, ({ action, tooltipText, icon, variant, isDisabled }) => (
        <Tooltip key={action} text={isDisabled(state, compileError) ? '' : tooltipText}>
          <Button
            variant={variant(state, compileError)}
            disabled={isDisabled(state, compileError)}
            onClick={() => onClick(action)}
          >
            <i className={`bi ${icon}`} />
          </Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  )
}
