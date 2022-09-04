import React from 'react'

import { VariableItemProps } from '.'

import useStoreMachineState from 'stores/storeMachineState'

export default function ({ id }: VariableItemProps): JSX.Element {
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
  return <small className={classes}>{value ?? '\u00A0'}</small>
}
