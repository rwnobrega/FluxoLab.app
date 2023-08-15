import { Position } from 'reactflow'

import { getBrighterColor, palette } from 'utils/colors'

import { Symbol } from '..'

import Label from './Label'
import Modal from './Modal'

const symbol: Symbol = {
  type: 'output_',
  title: 'Saída',
  boxStyle: {
    backgroundColor: getBrighterColor(palette.green),
    textColor: 'white',
    clipPath: 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)',
    clipPathBorder: 'polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))'
  },
  Label: Label,
  Modal: Modal,
  handles: [
    { id: 'in', type: 'target', position: Position.Top },
    { id: 'out', type: 'source', position: Position.Bottom }
  ]
}

export default symbol
