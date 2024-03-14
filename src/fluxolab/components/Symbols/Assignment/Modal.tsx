import React from 'react'

import SymbolModal from '../SymbolModal'
import { ModalProps } from '..'

export default function (otherProps: ModalProps): JSX.Element {
  return (
    <SymbolModal
      title='Atribuição'
      matchStartRule='Command_assignment'
      placeholder='Digite uma expressão de atribuição'
      {...otherProps}
    />
  )
}
