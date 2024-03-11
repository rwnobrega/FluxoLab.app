import _ from 'lodash'

import React, { useCallback, useEffect, useState } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import TextInput from 'components/General/TextInput'

import useStoreMachine from 'stores/storeMachine'

import isValidIdentifier from 'language/isValidIdentifier'

interface Props {
  id: string
  showModal: boolean
  setShowModal: (modal: boolean) => void
}

export default function ({ id, showModal, setShowModal }: Props): JSX.Element {
  const [textId, setTextId] = useState<string>(id)
  const [problem, setProblem] = useState<string | null>(null)

  const { machine, renameVariable } = useStoreMachine()

  useEffect(() => {
    setTextId(id)
  }, [showModal])

  useEffect(() => {
    let problem: string | null = null
    if (_.isEmpty(textId)) {
      problem = 'Identificador não pode ser vazio.'
    } else if (!isValidIdentifier(textId)) {
      problem = 'Identificador inválido.'
    } else if (textId !== id && _.includes(_.map(machine.variables, 'id'), textId)) {
      problem = 'Identificador já existe.'
    }
    setProblem(problem)
  }, [textId])

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTimeout(() => { renameVariable(id, textId) }, 200)
    setShowModal(false)
  }, [id, textId, renameVariable, setShowModal])

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Renomear variável</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextInput
            placeholder='Digite o novo identificador'
            value={textId}
            setValue={setTextId}
            problem={problem}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant='primary' type='submit' disabled={problem !== null}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
