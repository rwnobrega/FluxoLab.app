import React, { useCallback, useEffect, useState } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import grammar from 'language/grammar'
import { syntaxErrorMessage } from 'language/errors'

import TextInput from 'components/General/TextInput'

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
    const matchResult = grammar.match(textValue, 'Expression')
    if (matchResult.failed()) {
      const posNumber = matchResult.getInterval().startIdx
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
          <Modal.Title>Condicional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextInput
            placeholder='Digite uma expressão lógica'
            value={textValue}
            setValue={setTextValue}
            problem={problem}
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
