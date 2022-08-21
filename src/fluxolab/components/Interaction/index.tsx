import _ from 'lodash'

import React from 'react'

import Stack from 'react-bootstrap/Stack'

import ChatBubble from './ChatBubble'

import useStoreMachineState from 'stores/storeMachineState'

export default function (): JSX.Element {
  const { state } = useStoreMachineState()
  return (
    <div>
      <p className='fw-semibold'>Entrada / Saída</p>
      <Stack gap={1} className='p-2 overflow-auto'>
        {_.map(state.interaction, ({ direction, text }, index) => (
          <ChatBubble key={index} direction={direction} text={text} />
        ))}
      </Stack>
    </div>
  )
}
