import React from 'react'

import { ConnectionLineComponentProps } from 'reactflow'

import getSvgPathString from './getSvgPathString'

export default (props: ConnectionLineComponentProps): JSX.Element => {
  const { fromX, fromY, toX, toY } = props
  const svgPathString = getSvgPathString(props)
  return (
    <g>
      <path fill='none' stroke='gray' strokeWidth={2} d={svgPathString} />
      <circle cx={fromX} cy={fromY} r={3} fill='white' stroke='gray' strokeWidth={1} />
      <circle cx={toX} cy={toY} r={3} fill='white' stroke='gray' strokeWidth={1} />
    </g>
  )
}
