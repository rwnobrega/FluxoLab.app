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
      className='font-monospace'
      value={variable?.type}
      onChange={onChange}
      style={{ width: '6em' }}
      disabled={disabled}
    >
      <option value='num'>num</option>
      <option value='str'>str</option>
      <option value='bool'>bool</option>
    </Form.Select>
  )
}
