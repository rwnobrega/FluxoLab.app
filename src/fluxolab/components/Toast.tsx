import React from 'react'

import Toast from 'react-bootstrap/Toast'

import useStoreEphemeral from 'stores/useStoreEphemeral'

export default function (): JSX.Element {
  const { toastContent, setToastContent } = useStoreEphemeral()

  if (toastContent === null) {
    return <></>
  }

  return (
    <Toast
      bg='dark'
      className='text-white position-fixed bottom-0 end-0 m-3'
      delay={3000}
      autohide
      show={toastContent !== null}
      onClose={() => setToastContent(null)}
    >
      <Toast.Body>
        <i className={`bi ${toastContent.icon} me-2`} /> {toastContent.message}
      </Toast.Body>
    </Toast>
  )
}
