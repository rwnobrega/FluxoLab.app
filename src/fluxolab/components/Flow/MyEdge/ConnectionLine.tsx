import React from 'react'

import { ConnectionLineComponentProps } from 'reactflow'

export default ({ fromX, fromY, toX, toY }: ConnectionLineComponentProps): JSX.Element => {
  return (
    <g>
      <path d={`M ${fromX} ${fromY} L ${toX} ${toY}`} fill='none' stroke='gray' strokeWidth={4} />
      <circle cx={fromX} cy={fromY} r={6} fill='white' stroke='gray' strokeWidth={1} />
      <circle cx={toX} cy={toY} r={6} fill='white' stroke='gray' strokeWidth={1} />
    </g>
  )
}
