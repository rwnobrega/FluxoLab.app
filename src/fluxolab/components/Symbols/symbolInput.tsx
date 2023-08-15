import React from 'react'

import { Position } from 'reactflow'

import { getBrighterColor, palette } from 'utils/colors'

import { Symbol, LabelProps } from '.'

function LabelInput ({ value }: LabelProps): JSX.Element {
  return (
    <span>
      <i>Leia</i>
      {'\u00A0\u00A0'}
      <span className='font-monospace'>{value}</span>
    </span>
  )
}

const symbolInput: Symbol = {
  type: 'input_',
  title: 'Entrada',
  box: {
    backgroundColor: getBrighterColor(palette.blue),
    textColor: 'white',
    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)'
  },
  editable: true,
  Label: LabelInput,
  handles: [
    { id: 'in', type: 'target', position: Position.Top },
    { id: 'out', type: 'source', position: Position.Bottom }
  ]
}

export default symbolInput
