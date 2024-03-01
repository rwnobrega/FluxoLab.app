import React, { useEffect, useState } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import TextInput from 'components/General/TextInput'

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

  useEffect(() => {
    setTextValue(value)
  }, [showModal])

  function handleSubmit (event: any): void {
    event.preventDefault()
    setTimeout(() => { updateNodeProp(nodeId, 'data.value', textValue) }, 200)
    setShowModal(false)
  }

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Entrada de dados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row}>
            <Form.Label column className='fw-bold fst-italic' md='auto'>
              Leia
            </Form.Label>
            <Col>
              <TextInput
                placeholder='Digite o identificador da variável'
                value={textValue}
                setValue={setTextValue}
              />
            </Col>
          </Form.Group>
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
