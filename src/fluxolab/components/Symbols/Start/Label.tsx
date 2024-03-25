import React from 'react'

import useStoreStrings from 'stores/useStoreStrings'

export default function (): JSX.Element {
  const { getString } = useStoreStrings()
  return (
    <span style={{ position: 'relative', top: '-2.5px' }}>
      <i>{getString('Symbol_Start')}</i>
    </span>
  )
}
