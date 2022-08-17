import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'

import VariableModalRename from 'components/Modals/RenameVariable'

import { VariableItemProps } from '.'

export default function ({ id, disabled }: VariableItemProps): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <>
      <Button
        variant='secondary'
        size='sm'
        className='font-monospace'
        style={{ cursor: disabled ? 'default' : 'pointer' }}
        onClick={() => setShowModal(true)}
      >
        {id}
      </Button>
      <VariableModalRename id={id} showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}
