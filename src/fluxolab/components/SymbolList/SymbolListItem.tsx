import React from 'react'

import { BoxStyle } from 'components/Symbols'
import SymbolBox from 'components/Symbols/SymbolBox'

import useStoreMachineState from 'stores/useStoreMachineState'

interface Props {
  type: string
  title: string
  boxStyle: BoxStyle
}

export default function ({ type, title, boxStyle }: Props): JSX.Element {
  const { getState } = useStoreMachineState()

  const state = getState()
  const disabled = state.timeSlot >= 0

  function onDragStart (event: any): void {
    const mouseX = event.pageX - event.target.offsetLeft
    const mouseY = event.pageY - event.target.offsetTop
    const data = JSON.stringify({ type, mouseX, mouseY })
    event.dataTransfer.setData('application/reactflow', data)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable={!disabled}
      onDragStart={onDragStart}
      style={{
        cursor: disabled ? 'auto' : 'grab',
        width: 120
      }}
    >
      <SymbolBox boxStyle={boxStyle} isDisabled={disabled}>
        <span>{title}</span>
      </SymbolBox>
    </div>
  )
}
