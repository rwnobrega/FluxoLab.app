import React from 'react'

import SymbolModal from '../SymbolModal'
import { ModalProps } from '..'

export default function (otherProps: ModalProps): JSX.Element {
  return (
    <SymbolModal
      title='Saída'
      matchStartRule='Command_write'
      prefix='write '
      placeholder='Digite expressões separadas por vírgula'
      {...otherProps}
    />
  )
}
