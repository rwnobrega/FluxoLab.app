import React from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

interface Props {
  title: string
  message: string
  onConfirm: () => void
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

export default function (props: Props): JSX.Element {
  const { title, message, onConfirm, showModal, setShowModal } = props

  function handleCancel (): void {
    setShowModal(false)
  }

  function handleConfirm (): void {
    onConfirm()
    setShowModal(false)
  }

  return (
    <Modal show={showModal} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
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
