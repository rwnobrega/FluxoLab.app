import _ from 'lodash'

import React from 'react'

import SymbolListItem from './Item'
import symbols from 'components/symbols'

export default function (): JSX.Element {
  return (
    <div className='vstack gap-3'>
      {_.map(symbols, ({ type, title, box }) =>
        <SymbolListItem key={type} type={type} title={title} box={box} />
      )}
    </div>
  )
}
