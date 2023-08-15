import React from 'react'

import { Position } from 'reactflow'

import { getBrighterColor, palette } from 'utils/colors'

import { Symbol, LabelProps } from '.'

function LabelAssignment ({ value }: LabelProps): JSX.Element {
  return (
    <span className='font-monospace'>
      {value === '' ? <i>(vazio)</i> : value}
    </span>
  )
}

const symbolAssignment: Symbol = {
  type: 'assignment',
  title: 'Atribuição',
  box: {
    backgroundColor: getBrighterColor(palette.orange),
    textColor: 'white'
  },
  editable: true,
  Label: LabelAssignment,
  handles: [
    { id: 'in', type: 'target', position: Position.Top },
    { id: 'out', type: 'source', position: Position.Bottom }
  ]
}

export default symbolAssignment
