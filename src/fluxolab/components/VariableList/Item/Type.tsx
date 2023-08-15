import React from 'react'

import Form from 'react-bootstrap/Form'

import { VariableItemProps } from '.'

import useStoreMachine from 'stores/storeMachine'

import { Variable } from 'machine/types'

export default function ({ id, disabled }: VariableItemProps): JSX.Element {
  const { getVariable, changeVariableType } = useStoreMachine()
  const variable = getVariable(id)

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    changeVariableType(id, event.target.value as Variable['type'])
  }

  return (
    <Form.Select
      size='sm'
      value={variable?.type}
      onChange={onChange}
      style={{ minWidth: '7.5em' }}
      disabled={disabled}
    >
      <option value='num'>Número</option>
      <option value='str'>Texto</option>
      <option value='bool'>Lógico</option>
    </Form.Select>
  )
}
