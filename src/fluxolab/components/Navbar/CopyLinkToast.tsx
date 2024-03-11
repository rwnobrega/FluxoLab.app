import React from 'react'

import Toast from 'react-bootstrap/Toast'

import useStoreEphemeral from 'stores/useStoreEphemeral'

export default function (): JSX.Element {
  const { copyLinkToast, setCopyLinkToast } = useStoreEphemeral()

  return (
    <Toast
      bg='dark'
      className='text-white position-fixed bottom-0 end-0 m-3'
      delay={3000}
      autohide
      show={copyLinkToast}
      onClose={() => setCopyLinkToast(false)}
    >
      <Toast.Body>
        <i className='bi bi-clipboard-check me-1' />  Link copiado para a área de transferência.
      </Toast.Body>
    </Toast>
  )
}
