import React from 'react'

import useStoreStrings from 'stores/useStoreStrings'

import SymbolModal from '../SymbolModal'
import { ModalProps } from '..'

export default function (otherProps: ModalProps): JSX.Element {
  const { getString } = useStoreStrings()
  return (
    <SymbolModal
      title={getString('Symbol_Output')}
      prefixLabel={getString('Symbol_Write')}
      prefixCommand='write '
      matchStartRule='Command_write'
      placeholder={getString('Symbol_OutputPlaceholder')}
      {...otherProps}
    />
  )
}
