import _ from 'lodash'

import React, { useEffect, useState } from 'react'

import { EdgeProps } from 'reactflow'

import getSvgPathString from './getSvgPathString'

import useStoreMachine from 'stores/useStoreMachine'
import useStoreMachineState from 'stores/useStoreMachineState'

export default function (props: EdgeProps): JSX.Element {
  const [mouseHover, setMouseHover] = useState<boolean>(false)
  const [animated, setAnimated] = useState<boolean>(false)
  const { machine, compileErrors } = useStoreMachine()
  const { getState } = useStoreMachineState()
  const state = getState()

  useEffect(() => {
    const sourceNode = _.find(machine.flowchart, { id: props.source })
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
    setAnimated(props.source === sourceSymbolId && props.target === targetSymbolId)
  }, [state, machine])

  const svgPathString = getSvgPathString({
    fromX: props.sourceX,
    fromY: props.sourceY,
    toX: props.targetX,
    toY: props.targetY,
    fromPosition: props.sourcePosition,
    toPosition: props.targetPosition
  })

  return (
    <g>
      <path
        style={{
          strokeWidth: 2,
          stroke: props.selected === true ? 'blue' : 'gray',
          strokeOpacity: mouseHover ? 1 : 0.5,
          strokeDasharray: animated ? 5 : 0,
          animation: animated ? 'dashdraw 0.5s linear infinite' : 'none'
        }}
        className='react-flow__edge-path'
        d={svgPathString}
        markerEnd={props.markerEnd}
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
