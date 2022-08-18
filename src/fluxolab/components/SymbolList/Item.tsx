import React from 'react'

import { Box } from 'components/Symbols'
import SymbolBox from 'components/SymbolBox'

interface Props {
  type: string
  title: string
  box: Box
}

export default function ({ type, title, box }: Props): JSX.Element {
  function onDragStart (event: any): void {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div draggable onDragStart={onDragStart} style={{ cursor: 'move', width: 120 }}>
      <SymbolBox box={box}>
        <span>{title}</span>
      </SymbolBox>
    </div>
  )
}
