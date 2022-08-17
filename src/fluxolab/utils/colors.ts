import { convert, contrastBrightness, Color } from 'colvertize'

export function getBrighterColor (color: string, amount: number = 32): string {
  return convert(color as Color, 'css-hex', contrastBrightness({ brightness: amount }))
}

export function getDarkerColor (color: string, amount: number = 32): string {
  return convert(color as Color, 'css-hex', contrastBrightness({ brightness: -amount }))
}

export function getDropShadow (color: string): string {
  return `drop-shadow(+2px 0 2px ${color})
          drop-shadow(-2px 0 2px ${color})
          drop-shadow(0 +2px 2px ${color})
          drop-shadow(0 -2px 2px ${color})`
}

export function getStripedBackground (color: string): string {
  const colorBrighter = getDarkerColor(color)
  return `repeating-linear-gradient(
    45deg,
    ${color},
    ${color} 10px,
    ${colorBrighter} 10px,
    ${colorBrighter} 20px
  )`
}
