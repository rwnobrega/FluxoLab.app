import React from 'react'

import {
  useNodes,
  SmoothStepEdge,
  EdgeProps
} from 'reactflow'

import {
  getSmartEdge,
  svgDrawStraightLinePath,
  pathfindingAStarNoDiagonal
} from '@tisoap/react-flow-smart-edge'

export default function (props: EdgeProps): JSX.Element {
  const [mouseHover, setMouseHover] = React.useState<boolean>(false)
  const nodes = useNodes()

  const options = {
    nodePadding: 5,
    gridRatio: 5,
    drawEdge: svgDrawStraightLinePath,
    generatePath: pathfindingAStarNoDiagonal
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
        strokeWidth: 3,
        stroke: props.selected === true ? 'black' : 'gray',
        strokeOpacity: mouseHover ? 1 : 0.5
      }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      className='react-flow__edge-path'
      d={svgPathString}
      markerEnd={props.markerEnd}
    />
  )
}
