import React from 'react'

import Tooltip from 'components/Tooltip'

export default function (): JSX.Element {
  return (
    <Tooltip text='Meus fluxogramas'>
      <button type='button' className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#exampleModal'>
        <i className='bi bi-list' />
      </button>
    </Tooltip>
  )
}
