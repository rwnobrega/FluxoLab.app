import React from 'react'

import useStoreStrings from 'stores/useStoreStrings'

import { LabelProps } from '..'

export default function ({ value }: LabelProps): JSX.Element {
  const { getString } = useStoreStrings()
  return (
    <span className='font-monospace'>
      {value === '' ? <i>{getString('Symbol_Empty')}</i> : value}
    </span>
  )
}
