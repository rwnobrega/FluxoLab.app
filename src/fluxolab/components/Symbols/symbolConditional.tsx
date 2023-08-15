import React from 'react'

import { Position } from 'reactflow'

import { getBrighterColor, palette } from 'utils/colors'

import { Symbol, LabelProps } from '.'

function LabelConditional ({ value }: LabelProps): JSX.Element {
  return (
    <span className='font-monospace'>
      {value === '' ? <i>(vazio)</i> : value}
    </span>
  )
}

const symbolConditional: Symbol = {
  type: 'conditional',
  title: 'Condicional',
  box: {
    backgroundColor: getBrighterColor(palette.red),
    textColor: 'white',
    clipPath: 'polygon(20px 0, 0 50%, 20px 100%, calc(100% - 20px) 100%, 100% 50%, calc(100% - 20px) 0)'
  },
  editable: true,
  Label: LabelConditional,
  handles: [
    { id: 'in', type: 'target', position: Position.Top },
    { id: 'true', type: 'source', position: Position.Bottom, label: 'T' },
    { id: 'false', type: 'source', position: Position.Right, label: 'F' }
  ]
}

export default symbolConditional
