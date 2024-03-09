import React from 'react'

import { Position } from 'reactflow'

import getSvgPathString from './getSvgPathString'

interface Props {
  fromX: number
  fromY: number
  toX: number
  toY: number
  fromPosition: Position
  toPosition: Position
}

export default ({ fromX, fromY, toX, toY, fromPosition, toPosition }: Props): JSX.Element => {
  const svgPathString = getSvgPathString({ fromX, fromY, toX, toY, fromPosition, toPosition })
  return (
    <g>
      <circle cx={fromX} cy={fromY} r={3} fill='white' stroke='gray' strokeWidth={1} />
      <path fill='none' stroke='gray' strokeWidth={2} d={svgPathString} />
      <circle cx={toX} cy={toY} r={3} fill='white' stroke='gray' strokeWidth={1} />
    </g>
  )
}
