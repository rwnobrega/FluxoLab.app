import React from 'react'

import { LabelProps } from '..'

export default function ({ value }: LabelProps): JSX.Element {
  return (
    <span className='font-monospace'>
      {value === '' ? <i>(vazio)</i> : value}
    </span>
  )
}
