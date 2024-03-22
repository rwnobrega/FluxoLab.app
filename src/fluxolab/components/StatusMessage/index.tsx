import _ from 'lodash'

import React from 'react'

import Alert from 'react-bootstrap/Alert'
import Stack from 'react-bootstrap/Stack'

import Minidown from 'components/General/Minidown'

import useStoreEphemeral from 'stores/useStoreEphemeral'
import useStoreMachine from 'stores/useStoreMachine'
import useStoreMachineState from 'stores/useStoreMachineState'

import { palette } from 'utils/colors'

interface Triplet {
  backgroundColor: string
  statusIcon: string
  statusText: string
}

export default function (): JSX.Element {
  const { compileErrors } = useStoreMachine()
  const { getState } = useStoreMachineState()
  const { isDraggingNode, isConnectingEdge, mouseOverNodeId } = useStoreEphemeral()

  if (isDraggingNode || isConnectingEdge) return <></>

  const state = getState()

  function getTriplet (): Triplet {
    if (compileErrors.length > 0) {
      const hoveredNodeErrors = _.filter(compileErrors, { nodeId: mouseOverNodeId })
      const nonNodeErrors = _.filter(compileErrors, { nodeId: null })
      let statusText: string
      if (mouseOverNodeId === null || hoveredNodeErrors.length === 0) {
        if (nonNodeErrors.length > 0) {
          statusText = _.map(nonNodeErrors, 'message').join('\n')
        } else {
          statusText = `Há ${compileErrors.length} erro${compileErrors.length > 1 ? 's' : ''} de compilação.`
        }
      } else {
        if (hoveredNodeErrors.length === 1) {
          statusText = hoveredNodeErrors[0].message
        } else {
          statusText = `Múltiplos erros:\n${_.map(hoveredNodeErrors, 'message').join('\n')}`
        }
      }
      return {
        backgroundColor: palette.red,
        statusIcon: 'bi-exclamation-triangle-fill',
        statusText: statusText
      }
    } else if (state.status === 'error') {
      return {
        backgroundColor: palette.red,
        statusIcon: 'bi-exclamation-circle-fill',
        statusText: state.errorMessage as string
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

  const [mainStatus, ...rest] = statusText.split('\n')
  const smallStatus = rest.join('\n')

  return (
    <Alert className='m-0 border-0' style={{ backgroundColor, color: 'white', padding: '6px 12px' }}>
      <Stack direction='horizontal' style={{ alignItems: 'start' }}>
        <i className={`bi ${statusIcon}`} />
        <span className='ms-2' style={{ whiteSpace: 'pre-wrap' }}>
          <Minidown source={mainStatus} />
          <Minidown className='small' source={smallStatus} />
        </span>
      </Stack>
    </Alert>
  )
}
