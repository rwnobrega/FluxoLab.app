import _ from 'lodash'

import React, { useCallback, useEffect } from 'react'

import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'

import ChatBubble from './ChatBubble'

import runAction from 'components/PlayButtons/actions'

import useStoreMachineState from 'stores/storeMachineState'
import useStoreMachine from 'stores/storeMachine'

interface Props {
  refInput: React.RefObject<HTMLInputElement>
}

export default function ({ refInput }: Props): JSX.Element {
  const [inputText, setInputText] = React.useState('')

  const { machine } = useStoreMachine()
  const { state, setState, stateHistory, setStateHistory } = useStoreMachineState()

  const handleSendInput = useCallback(() => {
    if (inputText.length > 0) {
      state.input = inputText
      runAction('nextStep', { machine, state, setState, stateHistory, setStateHistory })
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