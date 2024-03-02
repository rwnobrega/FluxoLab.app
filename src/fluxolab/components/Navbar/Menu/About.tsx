import React from 'react'

import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Modal from 'react-bootstrap/Modal'

import Logo from 'assets/FluxoLab.svg'

interface Props {
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Image src={Logo} alt='Logo' width='32' height='32' className='me-3' />
        <Modal.Title>Sobre o FluxoLab</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <b>FluxoLab</b> é um aplicativo web projetado para ensinar fundamentos de algoritmos e programação usando fluxogramas.
        </p>
        <p>
          O código fonte está disponível no <a href='https://github.com/rwnobrega/FluxoLab.app'>GitHub</a>, sob a licença <a href='https://www.gnu.org/licenses/gpl-3.0.en.html'>GPL 3</a>.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShowModal(false)}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
