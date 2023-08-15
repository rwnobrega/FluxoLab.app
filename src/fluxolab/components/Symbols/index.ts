import { HandleType, Position } from 'reactflow'

import symbolStart from './symbolStart'
import symbolInput from './symbolInput'
import symbolOutput from './symbolOutput'
import symbolAssignment from './symbolAssignment'
import symbolConditional from './symbolConditional'
import symbolEnd from './symbolEnd'

export interface Box {
  backgroundColor?: string
  textColor?: string
  borderRadius?: string
  clipPath?: string
  clipPathBorder?: string
}

export interface LabelProps {
  value: string
}

export interface Symbol {
  type: string
  title: string
  box: Box
  editable: boolean
  Label: (props: LabelProps) => JSX.Element
  handles: Array<{ id: string, label?: string, type: HandleType, position: Position }>
}

const symbols: Symbol[] = [
  symbolStart,
  symbolInput,
  symbolOutput,
  symbolAssignment,
  symbolConditional,
  symbolEnd
]

export default symbols
