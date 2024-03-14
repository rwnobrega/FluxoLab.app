import React from 'react'

import SymbolModal from '../SymbolModal'
import { ModalProps } from '..'

export default function (otherProps: ModalProps): JSX.Element {
  return (
    <SymbolModal
      title='Condicional'
      matchStartRule='Expression'
      placeholder='Digite uma expressão lógica'
      {...otherProps}
    />
  )
}
