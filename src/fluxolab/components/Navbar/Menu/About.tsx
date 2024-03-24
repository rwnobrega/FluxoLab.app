import React from 'react'

import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Modal from 'react-bootstrap/Modal'

import Minidown from 'components/General/Minidown'

import Logo from 'assets/FluxoLab.svg'

import useStoreStrings from 'stores/useStoreStrings'

interface Props {
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { getString } = useStoreStrings()

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Image src={Logo} alt='Logo' width='32' height='32' className='me-3' />
        <Modal.Title>{getString('About_Title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <Minidown source={getString('About_Body1')} />
        </p>
        <p>
          <Minidown source={getString(
            'About_Body2',
            {
              GitHub: '[GitHub](https://github.com/rwnobrega/FluxoLab.app)',
              'GPL 3': '[GPL 3](https://www.gnu.org/licenses/gpl-3.0.en.html)'
            })}
          />
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShowModal(false)}>
          {getString('Close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
