import _ from 'lodash'

import React, { useCallback } from 'react'

import lzString from 'lz-string'

import Button from 'react-bootstrap/Button'

import Tooltip from 'components/General/Tooltip'

import useStoreFlow from 'stores/useStoreFlow'
import useStoreMachine from 'stores/useStoreMachine'
import useStoreEphemeral from 'stores/useStoreEphemeral'

export default function (): JSX.Element {
  const { nodes, edges } = useStoreFlow()
  const { machine, flowchartTitle } = useStoreMachine()
  const { setCopyLinkToast } = useStoreEphemeral()

  const handleCopyLink = useCallback(() => {
    const nodes0 = _.map(nodes, node => _.pick(node, ['id', 'type', 'position', 'data']))
    const edges0 = _.map(edges, edge => _.pick(edge, ['source', 'sourceHandle', 'target', 'targetHandle']))
    const state = {
      title: flowchartTitle,
      variables: machine.variables,
      nodes: nodes0,
      edges: edges0
    }
    const lz = lzString.compressToEncodedURIComponent(JSON.stringify(state))
    const baseUrl = window.location.href.split('?')[0]
    void navigator.clipboard.writeText(`${baseUrl}?lzs=${lz}`)
    setCopyLinkToast(true)
  }, [flowchartTitle, machine.variables, nodes, edges])

  return (
    <Tooltip text='Copiar link'>
      <Button variant='secondary' onClick={handleCopyLink}>
        <i className='bi bi-link' />
      </Button>
    </Tooltip>
  )
}
