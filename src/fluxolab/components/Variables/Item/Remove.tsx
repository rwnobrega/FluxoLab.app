import React from 'react'

import Button from 'react-bootstrap/Button'

import Tooltip from 'components/Tooltip'

import { VariableItemProps } from '.'

import useStoreMachine from 'stores/storeMachine'

export default function ({ id, disabled }: VariableItemProps): JSX.Element {
  const { removeVariable } = useStoreMachine()
  if (disabled) return <></>
  return (
    <Tooltip text='Remover variável'>
      <Button variant='danger' size='sm' onClick={() => removeVariable(id)}>
        🞪
      </Button>
    </Tooltip>
  )
}
