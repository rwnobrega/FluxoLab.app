import React from 'react'

import useStoreStrings from 'stores/useStoreStrings'

import { LabelProps } from '..'

export default function ({ value }: LabelProps): JSX.Element {
  const { getString } = useStoreStrings()
  return (
    <span>
      <i>{getString('Symbol_Write')}</i>
      {'\u00A0\u00A0'}
      <span className='font-monospace'>{value}</span>
    </span>
  )
}
