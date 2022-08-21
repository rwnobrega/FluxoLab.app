import React from 'react'

import Button from 'react-bootstrap/Button'

import Tooltip from 'components/Tooltip'

export default function (): JSX.Element {
  return (
    <Tooltip text='Meus fluxogramas'>
      <Button>
        <i className='bi bi-list' />
      </Button>
    </Tooltip>
  )
}
