import React from 'react'

import { VariableItemProps } from '.'

import { getVariableType } from 'machine/variables'

import useStoreMachineState from 'stores/storeMachineState'

export default function ({ id, type }: VariableItemProps): JSX.Element {
  const { getState } = useStoreMachineState()
  const state = getState()
  const value = state.memory[id]
  const classes = [
    'd-flex',
    'p-1',
    'fw-semibold font-monospace',
    'text-success bg-success',
    'bg-opacity-10',
    'border border-success border-opacity-10 rounded-1'
  ].join(' ')
  const variableType = getVariableType(type)
  return <small className={classes}>{variableType.format(value)}</small>
}
