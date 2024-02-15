import _ from 'lodash'

import React, { useCallback, useEffect, useRef } from 'react'

import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'

import ChatBubble from './ChatBubble'

import useStoreMachineState from 'stores/storeMachineState'
import useStoreMachine from 'stores/storeMachine'

interface Props {
  refInput: React.RefObject<HTMLInputElement>
}

export default function ({ refInput }: Props): JSX.Element {
  const refStackEnd = useRef<HTMLDivElement>(null)
  const [inputText, setInputText] = React.useState('')

  const { machine } = useStoreMachine()
  const { getState, nextStep, stateHistory } = useStoreMachineState()

  const state = getState()

  const handleSendInput = useCallback(() => {
    if (inputText.length > 0) {
      state.input = inputText
      nextStep(machine, refInput)
      setInputText('')
    }
  }, [inputText, machine, state, stateHistory])

  useEffect(() => {
    if (state.status === 'waiting') {
      refInput.current?.focus()
    }
  }, [state])

  useEffect(() => {
    if (refStackEnd.current != null) {
      refStackEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [state])

  return (
    <div className='d-flex flex-column h-100'>
      <p className='fw-semibold'>Entrada/saída</p>
      <Stack gap={2} className='mb-3' style={{ overflowY: 'auto', overflowX: 'clip' }}>
        {_.map(state.interaction, ({ direction, text }, index) => (
          <ChatBubble key={index} direction={direction} text={text} />
        ))}
        <div ref={refStackEnd} />
      </Stack>
      <Form.Control
        ref={refInput}
        size='sm'
        value={inputText}
        disabled={state.status !== 'waiting'}
        onChange={event => setInputText(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter') { handleSendInput() }
        }}
      />
    </div>
  )
}
