import React from 'react'

import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

interface Triplet {
  backgroundColor: string
  statusIcon: string
  statusText: string
}

export default function (): JSX.Element {
  const { compileError } = useStoreMachine()
  const { state } = useStoreMachineState()

  function getTriplet (): Triplet {
    if (compileError !== null) {
      return {
        backgroundColor: '#dc3545',
        statusIcon: 'bi-exclamation-triangle-fill',
        statusText: `Erro de compilação: ${compileError.message}`
      }
    } else if (state.status === 'error') {
      return {
        backgroundColor: '#dc3545',
        statusIcon: 'bi-exclamation-circle-fill',
        statusText: `Erro de execução: ${state.errorMessage as string}`
      }
    } else if (state.status === 'halted') {
      return {
        backgroundColor: '#6f42c1',
        statusIcon: 'bi-check-circle-fill-fill',
        statusText: 'Execução concluída.'
      }
    } else if (state.timeSlot === 0) {
      return {
        backgroundColor: '#6f42c1',
        statusIcon: 'bi-check-circle-fill',
        statusText: 'Pronto para iniciar execução.'
      }
    } else {
      return {
        backgroundColor: '#198754',
        statusIcon: 'bi-check-circle-fill',
        statusText: `Executado passo ${state.timeSlot}.`
      }
    }
  }

  const { backgroundColor, statusIcon, statusText } = getTriplet()

  return (
    <div role='alert' className='alert' style={{ backgroundColor, color: 'white' }}>
      <i className={`bi ${statusIcon}`} /><span className='ms-2'>{statusText}</span>
    </div>
  )
}
