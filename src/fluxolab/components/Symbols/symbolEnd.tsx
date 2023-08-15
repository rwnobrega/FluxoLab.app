import React from 'react'

import { Position } from 'reactflow'

import { getBrighterColor, palette } from 'utils/colors'

import { Symbol } from '.'

function LabelEnd (): JSX.Element {
  return <span><i>Fim</i></span>
}

const symbolEnd: Symbol = {
  type: 'end',
  title: 'Fim',
  box: {
    backgroundColor: getBrighterColor(palette.purple),
    textColor: 'white',
    borderRadius: '15px'
  },
  editable: false,
  Label: LabelEnd,
  handles: [
    { id: 'in', type: 'target', position: Position.Top }
  ]
}

export default symbolEnd
