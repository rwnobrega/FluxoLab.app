import React from 'react'

import Button from 'react-bootstrap/Button'

import Tooltip from 'components/General/Tooltip'

import { Props } from '.'

import useStoreMachine from 'stores/useStoreMachine'
import useStoreStrings from 'stores/useStoreStrings'

export default function ({ id, disabled }: Props): JSX.Element {
  const { getString } = useStoreStrings()

  const { removeVariable } = useStoreMachine()
  if (disabled) return <></>
  return (
    <Tooltip text={getString('VariableList_Remove')}>
      <Button variant='danger' size='sm' onClick={() => removeVariable(id)}>
        <i className='bi bi-trash-fill' />
      </Button>
    </Tooltip>
  )
}
