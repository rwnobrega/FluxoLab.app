import { Position } from 'reactflow'

import { getBrighterColor, palette } from 'utils/colors'

import { Symbol } from '..'

import Label from './Label'

const symbol: Symbol = {
  type: 'end',
  title: 'Fim',
  boxStyle: {
    backgroundColor: getBrighterColor(palette.purple),
    textColor: 'white',
    borderRadius: '15px'
  },
  Label: Label,
  handles: [
    { id: 'in', type: 'target', position: Position.Top }
  ]
}

export default symbol
