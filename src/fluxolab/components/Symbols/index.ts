import { HandleType, Position } from 'reactflow'

import symbolStart from './Start'
import symbolInput from './Input'
import symbolOutput from './Output'
import symbolAssignment from './Assignment'
import symbolConditional from './Conditional'
import symbolEnd from './End'

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

export interface ModalProps {
  nodeId: string
  value: string
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

export interface Symbol {
  type: string
  title: string
  box: Box
  Label: (props: LabelProps) => JSX.Element
  Modal?: (props: ModalProps) => JSX.Element
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
