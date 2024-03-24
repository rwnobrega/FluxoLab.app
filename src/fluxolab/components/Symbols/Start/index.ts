import { Position } from 'reactflow'

import { getBrighterColor, palette } from 'utils/colors'

import { Symbol } from '..'

import Label from './Label'

const symbol: Symbol = {
  type: 'start',
  title: 'Start',
  boxStyle: {
    backgroundColor: getBrighterColor(palette.purple),
    textColor: 'white',
    borderRadius: '15px'
  },
  Label: Label,
  handles: [
    { id: 'out', type: 'source', position: Position.Bottom }
  ]
}

export default symbol
