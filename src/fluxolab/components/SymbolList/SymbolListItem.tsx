import React from 'react'

import { BoxStyle } from 'components/Symbols'
import SymbolBox from 'components/Symbols/SymbolBox'

interface Props {
  type: string
  title: string
  boxStyle: BoxStyle
}

export default function ({ type, title, boxStyle }: Props): JSX.Element {
  function onDragStart (event: any): void {
    const mouseX = event.pageX - event.target.offsetLeft
    const mouseY = event.pageY - event.target.offsetTop
    const data = JSON.stringify({ type, mouseX, mouseY })
    event.dataTransfer.setData('application/reactflow', data)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div draggable onDragStart={onDragStart} style={{ cursor: 'move', width: 120 }}>
      <SymbolBox boxStyle={boxStyle}>
        <span>{title}</span>
      </SymbolBox>
    </div>
  )
}
