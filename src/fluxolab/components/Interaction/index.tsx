import _ from 'lodash'

import React from 'react'

import ChatBubble from './ChatBubble'

import useStoreMachineState from 'stores/storeMachineState'

export default function (): JSX.Element {
  const { state } = useStoreMachineState()
  return (
    <div>
      <p className='fw-semibold'>Interação</p>
      <div className='vstack gap-1 p-2 overflow-auto'>
        {_.map(state.interaction, ({ direction, text }, index) => (
          <ChatBubble key={index} direction={direction} text={text} />
        ))}
      </div>
    </div>
  )
}
