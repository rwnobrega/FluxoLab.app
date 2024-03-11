import _ from 'lodash'

import React from 'react'

import Form from 'react-bootstrap/Form'

import { Props } from '.'

import useStoreMachine from 'stores/useStoreMachine'

import { variableTypes } from 'machine/variables'
import { Variable } from 'machine/types'

export default function ({ id, disabled }: Props): JSX.Element {
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
      {
        _.map(variableTypes, ({ typeName }) => (
          <option key={typeName} value={typeName}>{typeName.charAt(0).toUpperCase() + typeName.slice(1)}</option>
        ))
      }
    </Form.Select>
  )
}
