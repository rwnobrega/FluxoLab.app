import { Dimensions, XYPosition } from 'reactflow'

export default function (center0: XYPosition, dim0: Dimensions, center1: XYPosition, dim1: Dimensions): boolean {
  const halfWidth1 = dim0.width / 2
  const halfHeight1 = dim0.height / 2
  const halfWidth2 = dim1.width / 2
  const halfHeight2 = dim1.height / 2

  return Math.abs(center0.x - center1.x) <= halfWidth1 + halfWidth2 && Math.abs(center0.y - center1.y) <= halfHeight1 + halfHeight2
}
