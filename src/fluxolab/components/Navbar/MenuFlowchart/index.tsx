import React, { useCallback, useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'

import Tooltip from 'components/General/Tooltip'

import Clear from './Clear'

import { serialize } from 'stores/serialize'
import useStoreFlow from 'stores/useStoreFlow'
import useStoreMachine from 'stores/useStoreMachine'
import useStoreEphemeral from 'stores/useStoreEphemeral'
import useStoreStrings from 'stores/useStoreStrings'

export default function (): JSX.Element {
  const [showClear, setShowClear] = useState(false)

  const { nodes, edges } = useStoreFlow()
  const { machine } = useStoreMachine()
  const { setToastContent } = useStoreEphemeral()
  const { getString } = useStoreStrings()

  const handleCopyLink = useCallback(() => {
    const lzs = serialize({ machine, nodes, edges })
    const baseUrl = window.location.href.split('?')[0]
    void navigator.clipboard.writeText(`${baseUrl}?lzs=${lzs}`)
    setToastContent({
      message: getString('CopyLink_ToastMessage'),
      icon: 'bi-clipboard-check',
      background: 'secondary'
    })
  }, [machine, nodes, edges])

  return (
    <>
      <Dropdown align='end'>
        <Tooltip text={getString('MenuFlowchart_Tooltip')}>
          <Dropdown.Toggle>
            <i className='bi bi-bounding-box-circles' />
          </Dropdown.Toggle>
        </Tooltip>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowClear(true)}>{`${getString('MenuFlowchart_Clear')}...`}</Dropdown.Item>
          <Dropdown.Item onClick={handleCopyLink}>{`${getString('MenuFlowchart_CopyLink')}`}</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Clear showModal={showClear} setShowModal={setShowClear} />
    </>

  )
}
