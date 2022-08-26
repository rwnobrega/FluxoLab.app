import _ from 'lodash'

import React, { useCallback } from 'react'

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import Tooltip from 'components/Tooltip'

import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

import execAction from './actions'
import buttonList from './buttonList'

interface Props {
  refInput: React.RefObject<HTMLInputElement>
}

export default function ({ refInput }: Props): JSX.Element {
  const { machine, compileError } = useStoreMachine()
  const { state, setState, stateHistory, setStateHistory } = useStoreMachineState()

  const onClick = useCallback(
    (action: string) => {
      if (action === 'nextStep' && state.status === 'waiting') {
        refInput.current?.focus()
        return
      }
      execAction(action, { machine, state, setState, stateHistory, setStateHistory })
      if (action === 'runAuto' && state.status === 'waiting') {
        refInput.current?.focus()
      }
    }
    , [machine, state, stateHistory]
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
