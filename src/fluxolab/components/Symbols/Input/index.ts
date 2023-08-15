import { Position } from 'reactflow'

import { getBrighterColor, palette } from 'utils/colors'

import { Symbol } from '..'

import Label from './Label'
import Modal from './Modal'

const symbol: Symbol = {
  type: 'input_',
  title: 'Entrada',
  box: {
    backgroundColor: getBrighterColor(palette.blue),
    textColor: 'white',
    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)'
  },
  Label: Label,
  Modal: Modal,
  handles: [
    { id: 'in', type: 'target', position: Position.Top },
    { id: 'out', type: 'source', position: Position.Bottom }
  ]
}

export default symbol
