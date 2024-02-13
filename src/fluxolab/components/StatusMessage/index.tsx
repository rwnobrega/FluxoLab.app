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
        statusIcon: 'bi-check-circle-fill',
        statusText: 'Execução concluída.'
      }
    } else if (state.timeSlot === -1) {
      return {
        backgroundColor: palette.purple,
        statusIcon: 'bi-check-circle-fill',
        statusText: 'Pronto para iniciar a execução.'
      }
    } else if (state.timeSlot === 0) {
      return {
        backgroundColor: palette.purple,
        statusIcon: 'bi-play-circle-fill',
        statusText: 'Execução iniciada.'
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
    <Alert className='m-0 border-0' style={{ backgroundColor, color: 'white', padding: '6px 12px' }}>
      <i className={`bi ${statusIcon}`} /><span className='ms-2'>{statusText}</span>
    </Alert>
  )
}
