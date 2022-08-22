import _ from 'lodash'

import React, { useCallback, useEffect } from 'react'

import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'

import ChatBubble from './ChatBubble'

import { runMachineStep } from 'machine/machine'

import useStoreMachineState from 'stores/storeMachineState'
import useStoreMachine from 'stores/storeMachine'

export default function (): JSX.Element {
  const refInput = React.useRef<HTMLInputElement>(null)

  const [inputText, setInputText] = React.useState('')

  const { machine } = useStoreMachine()
  const { state, setState, stateHistory, setStateHistory } = useStoreMachineState()

  const handleSendInput = useCallback(() => {
    if (inputText.length > 0) {
      stateHistory.push(state)
      setStateHistory(stateHistory)
      state.input = inputText
      runMachineStep(machine, state)
      setState(state)
      setInputText('')
    }
  }, [inputText, machine, state, stateHistory])

  useEffect(() => {
    if (state.status === 'waiting') {
      refInput.current?.focus()
    }
  }, [state])

  return (
    <div className='d-flex flex-column h-100'>
      <p className='fw-semibold'>Entrada/saída</p>
      <Stack gap={2} style={{ overflowY: 'auto', overflowX: 'clip' }}>
        {_.map(state.interaction, ({ direction, text }, index) => (
          <ChatBubble key={index} direction={direction} text={text} />
        ))}
      </Stack>
      {state.status === 'waiting' && (
        <Form.Control
          ref={refInput}
          size='sm'
          value={inputText}
          onChange={event => setInputText(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') { handleSendInput() }
          }}
        />
      )}
    </div>
  )
}
