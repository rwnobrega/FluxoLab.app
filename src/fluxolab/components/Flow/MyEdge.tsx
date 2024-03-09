import _ from 'lodash'

import React, { useEffect } from 'react'

import { useNodes, SmoothStepEdge, EdgeProps } from 'reactflow'

import {
  getSmartEdge,
  svgDrawSmoothLinePath,
  // svgDrawStraightLinePath,
  pathfindingAStarDiagonal
  // pathfindingAStarNoDiagonal,
  // pathfindingJumpPointNoDiagonal
} from '@tisoap/react-flow-smart-edge'

import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

export default function (props: EdgeProps): JSX.Element {
  const [mouseHover, setMouseHover] = React.useState<boolean>(false)
  const [animated, setAnimated] = React.useState<boolean>(false)
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

  const nodes = useNodes()
  const options = {
    nodePadding: 5,
    gridRatio: 5,
    drawEdge: svgDrawSmoothLinePath,
    generatePath: pathfindingAStarDiagonal
  }
  const getSmartEdgeResponse = getSmartEdge({ ...props, nodes, options })

  // If the value returned is null, it means "getSmartEdge" was unable to find
  // a valid path, and you should do something else instead
  if (getSmartEdgeResponse === null) {
    return <SmoothStepEdge {...props} />
  }

  const { svgPathString } = getSmartEdgeResponse

  return (
    <path
      style={{
        strokeWidth: 2,
        stroke: props.selected === true ? 'black' : 'gray',
        strokeOpacity: mouseHover ? 1 : 0.5,
        strokeDasharray: animated ? 5 : 0,
        animation: animated ? 'dashdraw 0.5s linear infinite' : 'none'
      }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      className='animated react-flow__edge-path'
      d={svgPathString}
      markerEnd={props.markerEnd}
    />
  )
}
