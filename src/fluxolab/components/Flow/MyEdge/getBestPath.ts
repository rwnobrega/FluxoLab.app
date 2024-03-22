import _ from 'lodash'

import { Node, Position, XYPosition } from 'reactflow'

import getPath from './getPath'

const pathTurns = (path: Array<[number, number]>): number => {
  return path.length - 1
}

const manhattanLength = (path: Array<[number, number]>): number => {
  let length = 0
  for (let i = 1; i < path.length; i++) {
    length += Math.abs(path[i][0] - path[i - 1][0]) + Math.abs(path[i][1] - path[i - 1][1])
  }
  return length
}

export default function (sourceNode: Node, targetNode: Node, sourcePosition: Position): [Array<[number, number]>, Position] {
  const sourceDimensions = {
    width: sourceNode.width as number,
    height: sourceNode.height as number
  }
  const sourceCenter: XYPosition = {
    x: sourceNode.position.x + sourceDimensions.width / 2,
    y: sourceNode.position.y + sourceDimensions.height / 2
  }
  const targetDimensions = {
    width: targetNode.width as number,
    height: targetNode.height as number
  }
  const targetCenter: XYPosition = {
    x: targetNode.position.x + targetDimensions.width / 2,
    y: targetNode.position.y + targetDimensions.height / 2
  }

  const positions = [Position.Top, Position.Left, Position.Right]

  // TODO: Not all positions are valid for all nodes --- filter out invalid positions

  const paths = _.map(
    positions, targetPosition => (
      getPath(
        sourcePosition,
        targetPosition,
        sourceCenter,
        targetCenter,
        sourceDimensions,
        targetDimensions
      )
    )
  )

  const bestPath = _.minBy(paths, path => 100 * pathTurns(path) + manhattanLength(path)) ?? paths[0]
  const bestPathIndex = _.indexOf(paths, bestPath)

  return [bestPath, positions[bestPathIndex]]
}
