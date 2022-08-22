import { convert, contrastBrightness, Color } from 'colvertize'

export const palette: {[key: string]: string} = {
  blue: '#0d6efd',
  indigo: '#6610f2',
  purple: '#6f42c1',
  pink: '#d63384',
  red: '#dc3545',
  orange: '#fd7e14',
  yellow: '#ffc107',
  green: '#198754',
  teal: '#20c997',
  cyan: '#0dcaf0',
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#adb5bd',
  gray600: '#6c757d',
  gray700: '#495057',
  gray800: '#343a40',
  gray900: '#212529'
}

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
  const darkerColor = getDarkerColor(color)
  return `repeating-linear-gradient(
    45deg,
    ${color},
    ${color} 10px,
    ${darkerColor} 10px,
    ${darkerColor} 20px
  )`
}
