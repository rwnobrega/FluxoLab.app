import _ from 'lodash'

import React, { useEffect, useState } from 'react'

import { EdgeProps } from 'reactflow'

import { getDarkerColor, palette } from 'utils/colors'

import getSvgPathString from './getSvgPathString'

import useStoreMachine from 'stores/useStoreMachine'
import useStoreMachineState from 'stores/useStoreMachineState'

export default function ({ source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, selected }: EdgeProps): JSX.Element {
  const [mouseHover, setMouseHover] = useState<boolean>(false)
  const [animated, setAnimated] = useState<boolean>(false)
  const { machine, compileErrors } = useStoreMachine()
  const { getState } = useStoreMachineState()
  const state = getState()

  useEffect(() => {
    const sourceNode = _.find(machine.flowchart, { id: source })
    if (sourceNode === undefined || compileErrors.length > 0) {
      setAnimated(false)
      return
    }
    if (sourceNode.id === machine.startSymbolId) {
      setAnimated(state.timeSlot === -1)
      return
    }
    // Peek the future --- TODO: What if `rand` or `rand_int` is used?
    const stateClone = _.cloneDeep(state)
    const sourceSymbolId = stateClone.curSymbolId
    sourceNode.work(machine, stateClone)
    const targetSymbolId = stateClone.curSymbolId
    setAnimated(source === sourceSymbolId && target === targetSymbolId)
  }, [state, machine])

  const svgPathString = getSvgPathString({
    fromX: sourceX,
    fromY: sourceY,
    toX: targetX,
    toY: targetY,
    fromPosition: sourcePosition,
    toPosition: targetPosition
  })

  return (
    <g>
      <path
        style={{
          strokeWidth: 2,
          stroke: getDarkerColor(selected === true ? palette.blue : palette.gray500, mouseHover ? 48 : 0),
          strokeDasharray: animated ? 5 : 0,
          animation: animated ? 'dashdraw 0.5s linear infinite' : 'none'
        }}
        className='react-flow__edge-path'
        d={svgPathString}
      />
      <path
        d={`M${targetX},${targetY} L${targetX - 2},${targetY - 4} L${targetX + 2},${targetY - 4} Z`}
        fill={getDarkerColor(selected === true ? palette.blue : palette.gray500, mouseHover ? 48 : 0)}
        stroke={getDarkerColor(selected === true ? palette.blue : palette.gray500, mouseHover ? 48 : 0)}
      />
      {/* This is a hack to make the edge more clickable */}
      <path
        style={{ strokeWidth: 16, strokeOpacity: 0 }}
        onMouseEnter={() => setMouseHover(true)}
        onMouseLeave={() => setMouseHover(false)}
        className='react-flow__edge-path'
        d={svgPathString}
      />
    </g>
  )
}
