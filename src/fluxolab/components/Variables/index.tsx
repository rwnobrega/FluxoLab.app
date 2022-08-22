import _ from 'lodash'

import React, { useCallback } from 'react'

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

import VariableItem from './Item'

export default function (): JSX.Element {
  const { machine, addVariable } = useStoreMachine()
  const { state } = useStoreMachineState()

  const getNextVariableId = useCallback(
    () => {
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
    }, [machine]
  )

  return (
    <div>
      <div className='d-flex flex-row justify-content-between align-items-center mb-2 gap-3'>
        <span className='fw-semibold'>Variáveis</span>
        <Button
          size='sm'
          className='fw-semibold text-nowrap'
          onClick={() => addVariable(getNextVariableId(), 'num')}
          disabled={state.timeSlot !== 0}
        >
          Adicionar variável
        </Button>
      </div>
      <Table size='sm' variant='borderless'>
        <tbody>
          {_.map(machine.variables, ({ id }, index) => (
            <VariableItem key={index} id={id} disabled={state.timeSlot !== 0} />
          ))}
        </tbody>
      </Table>
    </div>
  )
}
