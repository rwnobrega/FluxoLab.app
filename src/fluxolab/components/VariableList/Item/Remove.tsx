import React from 'react'

import Button from 'react-bootstrap/Button'

import Tooltip from 'components/General/Tooltip'

import { Props } from '.'

import useStoreMachine from 'stores/useStoreMachine'

export default function ({ id, disabled }: Props): JSX.Element {
  const { removeVariable } = useStoreMachine()
  if (disabled) return <></>
  return (
    <Tooltip text='Remover variável'>
      <Button variant='danger' size='sm' onClick={() => removeVariable(id)}>
        <i className='bi bi-trash-fill' />
      </Button>
    </Tooltip>
  )
}
