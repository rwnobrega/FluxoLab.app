import _ from 'lodash'

import React from 'react'

import Form from 'react-bootstrap/Form'

import { VariableItemProps } from '.'

import useStoreMachine from 'stores/storeMachine'

import { variableTypes } from 'machine/variables'
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
      {
        _.map(variableTypes, ({ typeName, jsName }) => (
          <option key={typeName} value={typeName}>{jsName.charAt(0).toUpperCase() + jsName.slice(1)}</option>
        ))
      }
    </Form.Select>
  )
}
