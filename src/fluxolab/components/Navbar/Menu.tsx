import React, { useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'

import ConfirmModal from 'components/Modals/Confirm'
import AboutModal from 'components/Modals/About'

import useStoreFlow from 'stores/storeFlow'
import useStoreMachine from 'stores/storeMachine'

export default function (): JSX.Element {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)

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
          <Dropdown.Item onClick={() => setShowConfirmModal(true)}>Limpar fluxograma...</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowAboutModal(true)}>Sobre...</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ConfirmModal
        title='Limpar fluxograma'
        message='Você tem certeza que deseja limpar o fluxograma?'
        onConfirm={handleConfirm}
        showModal={showConfirmModal}
        setShowModal={setShowConfirmModal}
      />
      <AboutModal
        showModal={showAboutModal}
        setShowModal={setShowAboutModal}
      />
    </>
  )
}
