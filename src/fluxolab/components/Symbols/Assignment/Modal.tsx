import React from 'react'

import useStoreStrings from 'stores/useStoreStrings'

import SymbolModal from '../SymbolModal'
import { ModalProps } from '..'

export default function (otherProps: ModalProps): JSX.Element {
  const { getString } = useStoreStrings()
  return (
    <SymbolModal
      title={getString('Symbol_Assignment')}
      matchStartRule='Command_assignment'
      placeholder={getString('Symbol_AssignmentPlaceholder')}
      {...otherProps}
    />
  )
}
