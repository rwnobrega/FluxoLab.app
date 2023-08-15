import React from 'react'

import { Position } from 'reactflow'

import { getBrighterColor, palette } from 'utils/colors'

import { Symbol, LabelProps } from '.'

function LabelOutput ({ value }: LabelProps): JSX.Element {
  return (
    <span>
      <i>Escreva</i>
      {'\u00A0\u00A0'}
      "<span className='font-monospace'>{value}</span>"
    </span>
  )
}

const symbolOutput: Symbol = {
  type: 'output_',
  title: 'Saída',
  box: {
    backgroundColor: getBrighterColor(palette.green),
    textColor: 'white',
    clipPath: 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)',
    clipPathBorder: 'polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))'
  },
  editable: true,
  Label: LabelOutput,
  handles: [
    { id: 'in', type: 'target', position: Position.Top },
    { id: 'out', type: 'source', position: Position.Bottom }
  ]
}

export default symbolOutput
