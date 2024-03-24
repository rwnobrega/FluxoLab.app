import _ from 'lodash'

import React, { useCallback } from 'react'

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import useStoreMachine from 'stores/useStoreMachine'
import useStoreMachineState from 'stores/useStoreMachineState'
import useStoreStrings from 'stores/useStoreStrings'

import VariableItem from './Item'

export default function (): JSX.Element {
  const { machine, addVariable } = useStoreMachine()
  const { getState, reset } = useStoreMachineState()
  const { getString } = useStoreStrings()

  const state = getState()

  const getNextVariableId = useCallback(() => {
    const prefix = 'var'
    let i = 1
    while (true) {
      const id = `${prefix}${i}`
      const allIds = _.map(machine.variables, 'id')
      if (!_.includes(allIds, id)) {
        return id
      }
      i++
    }
  }, [machine])

  const handleAddVariable = useCallback(() => {
    addVariable(getNextVariableId(), 'number')
    reset(machine)
  }, [addVariable, getNextVariableId, reset, machine])

  return (
    <div className='d-flex flex-column h-100'>
      <div className='d-flex flex-row justify-content-between align-items-center mb-2 gap-3'>
        <span className='fw-semibold'>
          {getString('VariableList_Title')}
        </span>
        <Button
          size='sm'
          className='fw-semibold text-nowrap'
          onClick={handleAddVariable}
          disabled={state.timeSlot !== -1}
        >
          {getString('VariableList_Add')}
        </Button>
      </div>
      <div style={{ overflowY: 'auto', overflowX: 'clip' }}>
        <Table size='sm' variant='borderless' className='mb-0'>
          <tbody>
            {_.map(machine.variables, ({ id, type }, index) => (
              <VariableItem key={index} id={id} type={type} disabled={state.timeSlot !== -1} />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
