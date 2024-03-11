import React, { useCallback, useEffect, useState } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import TextInput from 'components/General/TextInput'

import grammar from 'language/grammar'
import { syntaxErrorMessage } from 'language/errors'

import useStoreFlow from 'stores/useStoreFlow'

interface Props {
  nodeId: string
  value: string
  showModal: boolean
  setShowModal: (modal: boolean) => void
}

export default function ({ nodeId, value, showModal, setShowModal }: Props): JSX.Element {
  const [textValue, setTextValue] = useState<string>(value)
  const [problem, setProblem] = useState<string | null>(null)

  const { updateNodeProp } = useStoreFlow()

  useEffect(() => {
    setTextValue(value)
  }, [showModal])

  useEffect(() => {
    const matchResult = grammar.match(`read ${textValue}`, 'Command_read')
    if (matchResult.failed()) {
      const posNumber = matchResult.getInterval().startIdx - 'read '.length
      const problem = `Posição ${posNumber}: ${syntaxErrorMessage(matchResult)}`
      setProblem(problem)
    } else {
      setProblem(null)
    }
  }, [textValue])

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTimeout(() => { updateNodeProp(nodeId, 'data', textValue) }, 200)
    setShowModal(false)
  }, [nodeId, textValue, updateNodeProp, setShowModal])

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
                problem={problem}
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
