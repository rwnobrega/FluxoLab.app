import React, { useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'

import ConfirmModal from 'components/Modals/ConfirmModal'

import useStoreFlow from 'stores/storeFlow'
import useStoreMachine from 'stores/storeMachine'

export default function (): JSX.Element {
  const [showModal, setShowModal] = useState(false)

  const { clearAll } = useStoreFlow()
  const { clearVariables, setFlowchartTitle } = useStoreMachine()

  function handleConfirm (): void {
    clearAll()
    clearVariables()
    setFlowchartTitle('Fluxograma sem título')
  }

  return (
    <>
      <Dropdown align='end'>
        <Dropdown.Toggle>
          Menu
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowModal(true)}>Limpar fluxograma</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
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
