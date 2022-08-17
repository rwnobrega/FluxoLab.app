import _ from 'lodash'

import React, { useEffect, useState } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import useStoreMachine from 'stores/storeMachine'

interface Props {
  id: string
  showModal: boolean
  setShowModal: (modal: boolean) => void
}

export default function ({ id, showModal, setShowModal }: Props): JSX.Element {
  const [textId, setTextId] = useState<string>(id)
  const [problem, setProblem] = useState<string | null>(null)

  const { machine, renameVariable } = useStoreMachine()

  function handleSubmit (event: any): void {
    event.preventDefault()
    setTimeout(() => { renameVariable(id, textId) }, 200)
    setShowModal(false)
  }

  useEffect(() => {
    let problem: string|null = null
    if (_.isEmpty(textId)) {
      problem = 'Identificador não pode ser vazio.'
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(textId)) {
      problem = 'Identificador inválido.'
    } else if (textId !== id && _.includes(_.map(machine.variables, 'id'), textId)) {
      problem = 'Identificador já existe.'
    }
    setProblem(problem)
  }, [textId])

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Renomear variável</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type='text'
            className={`font-monospace ${problem !== null ? 'is-invalid' : ''}`}
            placeholder='Digite o novo identificador'
            autoFocus
            autoComplete='off'
            value={textId}
            onChange={event => setTextId(event.target.value)}
            onFocus={event => event.target.select()}
          />
          <div className='pt-2 small text-danger'>
            {problem ?? '\u00A0'}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant='primary' type='submit' disabled={problem !== null}>
            Renomear
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
