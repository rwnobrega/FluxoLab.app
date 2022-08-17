import _ from 'lodash'

import React from 'react'

import { InteractionAtom } from 'machine/types'

import useStoreMachineState from 'stores/storeMachineState'

const spanClasses = {
  common: 'badge font-monospace fw-normal p-2',
  in: 'text-bg-primary align-self-center',
  out: 'text-bg-success'
}

const divClasses = {
  common: 'd-flex',
  in: 'align-self-end',
  out: 'align-self-start'
}

export default function (): JSX.Element {
  const { state } = useStoreMachineState()
  return (
    <div>
      <p className='fw-semibold'>Interação</p>
      <div className='vstack gap-1 p-2 overflow-auto'>
        {_.map(state.interaction, ({ direction, text }: InteractionAtom, index) => (
          <div className={`${divClasses.common} ${divClasses[direction]}`} key={index}>
            <span className={`${spanClasses.common} ${spanClasses[direction]}`}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
