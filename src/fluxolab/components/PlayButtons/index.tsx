import _ from 'lodash'

import React from 'react'

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import Tooltip from 'components/General/Tooltip'

import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState, { Action } from 'stores/storeMachineState'

import buttonList from './buttonList'

interface Props {
  refInput: React.RefObject<HTMLInputElement>
}

export default function ({ refInput }: Props): JSX.Element {
  const { machine, compileErrors } = useStoreMachine()
  const { getState, execAction } = useStoreMachineState()

  const state = getState()

  const onClick = (action: Action): void => {
    execAction(action, machine, refInput)
  }

  return (
    <ButtonGroup>
      {_.map(buttonList, ({ action, description, hotkey, icon, isDisabled }) => {
        const disabled = isDisabled({ state, compileErrors })
        const tooltipText = disabled ? '' : `${description} (${hotkey})`
        return (
          <Tooltip key={action} text={tooltipText}>
            <Button disabled={disabled} onClick={() => onClick(action)}>
              <i className={`bi ${icon}`} />
            </Button>
          </Tooltip>
        )
      })}
    </ButtonGroup>
  )
}
