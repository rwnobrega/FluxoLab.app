import React, { useCallback } from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import useStoreFlow from 'stores/useStoreFlow'
import useStoreMachine from 'stores/useStoreMachine'
import useStoreStrings from 'stores/useStoreStrings'

interface Props {
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { clearAll } = useStoreFlow()
  const { clearMachine } = useStoreMachine()
  const { getString } = useStoreStrings()

  const handleCancel = useCallback(() => {
    setShowModal(false)
  }, [setShowModal])

  const handleConfirm = useCallback(() => {
    clearAll()
    clearMachine()
    setShowModal(false)
  }, [clearAll, clearMachine, setShowModal])

  return (
    <Modal show={showModal} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{getString('Clear_Title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{getString('Clear_Body')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCancel}>
          {getString('Cancel')}
        </Button>
        <Button variant='primary' onClick={handleConfirm}>
          {getString('Clear')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
