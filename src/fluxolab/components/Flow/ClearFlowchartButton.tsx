import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'

import ConfirmModal from 'components/Modals/ConfirmModal'
import Tooltip from 'components/Tooltip'

import useStoreFlow from 'stores/storeFlow'
import useStoreMachine from 'stores/storeMachine'

export default function (): JSX.Element {
  const [showModal, setShowModal] = useState(false)

  const { clearAll } = useStoreFlow()
  const { clearVariables } = useStoreMachine()

  function handleConfirm (): void {
    clearAll()
    clearVariables()
  }

  return (
    <>
      <Tooltip text='Limpar fluxograma'>
        <Button variant='danger' onClick={() => setShowModal(true)}>
          <i className='i bi-x-circle-fill' />
        </Button>
      </Tooltip>
      <ConfirmModal
        title='Limpar fluxograma'
        message='Você tem certeza que deseja limpar o fluxograma?'
        onConfirm={handleConfirm}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  )
}
