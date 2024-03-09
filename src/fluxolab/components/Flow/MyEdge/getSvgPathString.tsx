import { Position, useNodes } from 'reactflow'

import {
  getSmartEdge,
  svgDrawSmoothLinePath,
  // svgDrawStraightLinePath,
  pathfindingAStarDiagonal
  // pathfindingAStarNoDiagonal,
  // pathfindingJumpPointNoDiagonal
} from '@tisoap/react-flow-smart-edge'

interface Props {
  fromX: number
  fromY: number
  toX: number
  toY: number
  fromPosition: Position
  toPosition: Position
}

export default ({ fromX, fromY, toX, toY, fromPosition, toPosition }: Props): string => {
  const options = {
    nodePadding: 5,
    gridRatio: 5,
    drawEdge: svgDrawSmoothLinePath,
    generatePath: pathfindingAStarDiagonal
  }
  const nodes = useNodes()

  const getSmartEdgeResponse = getSmartEdge({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
    nodes,
    options
  })

  // If the value returned is null, it means "getSmartEdge" was unable to find
  // a valid path, and you should do something else instead
  if (getSmartEdgeResponse === null) {
    return `M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`
  } else {
    return getSmartEdgeResponse.svgPathString
  }
}
