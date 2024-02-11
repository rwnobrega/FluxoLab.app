import React from 'react'

import { LabelProps } from '..'

export default function ({ value }: LabelProps): JSX.Element {
  return (
    <span>
      <i>Escreva</i>
      {'\u00A0\u00A0'}
      <span className='font-monospace'>{value}</span>
    </span>
  )
}
