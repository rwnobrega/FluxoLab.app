import React from 'react'

import Alert from 'react-bootstrap/Alert'

import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

import { palette } from 'utils/colors'

interface Triplet {
  backgroundColor: string
  statusIcon: string
  statusText: string
}

export default function (): JSX.Element {
  const { compileError } = useStoreMachine()
  const { getState } = useStoreMachineState()

  const state = getState()

  function getTriplet (): Triplet {
    if (compileError !== null) {
      return {
        backgroundColor: palette.red,
        statusIcon: 'bi-exclamation-triangle-fill',
        statusText: `Erro de compilação: ${compileError.message}`
      }
    } else if (state.status === 'error') {
      return {
        backgroundColor: palette.red,
        statusIcon: 'bi-exclamation-circle-fill',
        statusText: `Erro de execução: ${state.errorMessage as string}`
      }
    } else if (state.status === 'halted') {
      return {
        backgroundColor: palette.purple,
        statusIcon: 'bi-check-circle-fill-fill',
        statusText: 'Execução concluída.'
      }
    } else if (state.timeSlot === 0) {
      return {
        backgroundColor: palette.purple,
        statusIcon: 'bi-check-circle-fill',
        statusText: 'Pronto para iniciar execução.'
      }
    } else {
      return {
        backgroundColor: palette.green,
        statusIcon: 'bi-check-circle-fill',
        statusText: `Executado passo ${state.timeSlot}.`
      }
    }
  }

  const { backgroundColor, statusIcon, statusText } = getTriplet()

  return (
    <Alert style={{ backgroundColor, color: 'white' }}>
      <i className={`bi ${statusIcon}`} /><span className='ms-2'>{statusText}</span>
    </Alert>
  )
}
