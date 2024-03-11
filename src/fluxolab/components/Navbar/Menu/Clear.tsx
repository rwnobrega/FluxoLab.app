import React, { useCallback } from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import useStoreFlow from 'stores/storeFlow'
import useStoreMachine from 'stores/storeMachine'

interface Props {
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { clearAll } = useStoreFlow()
  const { clearVariables, setFlowchartTitle } = useStoreMachine()

  const handleCancel = useCallback(() => {
    setShowModal(false)
  }, [setShowModal])

  const handleConfirm = useCallback(() => {
    clearAll()
    clearVariables()
    setFlowchartTitle('Fluxograma sem título')
    setShowModal(false)
  }, [clearAll, clearVariables, setFlowchartTitle, setShowModal])

  return (
    <Modal show={showModal} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Limpar fluxograma</Modal.Title>
      </Modal.Header>
      <Modal.Body>Você tem certeza que deseja limpar o fluxograma?</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant='primary' onClick={handleConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
