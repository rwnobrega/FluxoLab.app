import React from 'react'

import { Box } from 'components/symbols'
import SymbolBox from 'components/SymbolBox'

interface Props {
  type: string
  title: string
  box: Box
}

export default function ({ type, title, box }: Props): JSX.Element {
  function onDragStart (event: any): void {
    const mouseX = event.pageX - event.target.offsetLeft
    const mouseY = event.pageY - event.target.offsetTop
    const data = JSON.stringify({ type, mouseX, mouseY })
    event.dataTransfer.setData('application/reactflow', data)
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
