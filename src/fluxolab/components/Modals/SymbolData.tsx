import React, { useState } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import useStoreFlow from 'stores/storeFlow'

interface Props {
  nodeId: string
  value: string
  showModal: boolean
  setShowModal: (modal: boolean) => void
}

export default function ({ nodeId, value, showModal, setShowModal }: Props): JSX.Element {
  const [textValue, setTextValue] = useState<string>(value)

  const { updateNodeProp } = useStoreFlow()

  function handleSubmit (event: any): void {
    event.preventDefault()
    setTimeout(() => { updateNodeProp(nodeId, 'data.value', textValue) }, 200)
    setShowModal(false)
  }

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar valor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type='text'
            className='font-monospace'
            placeholder='Digite o novo valor'
            autoFocus
            autoComplete='off'
            value={textValue}
            onChange={event => setTextValue(event.target.value)}
            onFocus={event => event.target.select()}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant='primary' type='submit'>
            Confirmar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
