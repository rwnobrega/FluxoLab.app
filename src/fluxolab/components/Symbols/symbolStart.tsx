import React from 'react'

import { Position } from 'reactflow'

import { getBrighterColor, palette } from 'utils/colors'

import { Symbol } from '.'

function LabelStart (): JSX.Element {
  return <span><i>Início</i></span>
}

const symbolStart: Symbol = {
  type: 'start',
  title: 'Início',
  box: {
    backgroundColor: getBrighterColor(palette.purple),
    textColor: 'white',
    borderRadius: '15px'
  },
  editable: false,
  Label: LabelStart,
  handles: [
    { id: 'out', type: 'source', position: Position.Bottom }
  ]
}

export default symbolStart
