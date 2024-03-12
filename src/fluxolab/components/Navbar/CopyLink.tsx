import React, { useCallback } from 'react'

import Button from 'react-bootstrap/Button'

import Tooltip from 'components/General/Tooltip'

import { serialize } from 'stores/serialize'
import useStoreFlow from 'stores/useStoreFlow'
import useStoreMachine from 'stores/useStoreMachine'
import useStoreEphemeral from 'stores/useStoreEphemeral'

export default function (): JSX.Element {
  const { nodes, edges } = useStoreFlow()
  const { machine } = useStoreMachine()
  const { setToastContent } = useStoreEphemeral()

  const handleCopyLink = useCallback(() => {
    const lzs = serialize({ machine, nodes, edges })
    const baseUrl = window.location.href.split('?')[0]
    void navigator.clipboard.writeText(`${baseUrl}?lzs=${lzs}`)
    setToastContent({
      message: 'Link copiado para a área de transferência.',
      icon: 'bi-clipboard-check',
      background: 'secondary'
    })
  }, [machine, nodes, edges])

  return (
    <Tooltip text='Copiar link'>
      <Button variant='secondary' onClick={handleCopyLink}>
        <i className='bi bi-link' />
      </Button>
    </Tooltip>
  )
}
