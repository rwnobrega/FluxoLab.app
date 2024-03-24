import _ from 'lodash'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'

import ChatBubble from './ChatBubble'

import useStoreMachineState from 'stores/useStoreMachineState'
import useStoreMachine from 'stores/useStoreMachine'
import useStoreEphemeral from 'stores/useStoreEphemeral'
import useStoreStrings from 'stores/useStoreStrings'

export default function (): JSX.Element {
  const refInput = useRef<HTMLInputElement>(null)
  const refStackEnd = useRef<HTMLDivElement>(null)
  const [inputText, setInputText] = useState('')

  const { machine } = useStoreMachine()
  const { getState, nextStep, stateHistory } = useStoreMachineState()
  const { setRefInput } = useStoreEphemeral()
  const { getString } = useStoreStrings()

  const state = getState()

  useEffect(() => {
    setRefInput(refInput)
  }, [refInput])

  const handleSendInput = useCallback(() => {
    if (inputText.length > 0) {
      state.input = inputText
      nextStep(machine)
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
      <p className='fw-semibold'>
        {getString('Interaction_Title')}
      </p>
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
