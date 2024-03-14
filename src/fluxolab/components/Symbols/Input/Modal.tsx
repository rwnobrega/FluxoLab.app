import React from 'react'

import SymbolModal from '../SymbolModal'
import { ModalProps } from '..'

export default function (otherProps: ModalProps): JSX.Element {
  return (
    <SymbolModal
      title='Entrada'
      matchStartRule='Command_read'
      prefix='read '
      placeholder='Digite o identificador da variável'
      {...otherProps}
    />
  )
}
