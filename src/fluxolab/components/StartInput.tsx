import React from 'react'

import useStoreFlow from 'stores/storeFlow'
import useStoreMachineState from 'stores/storeMachineState'

export default function (): JSX.Element {
  const { startInputText, setStartInputText } = useStoreFlow()
  const { state } = useStoreMachineState()

  return (
    <div>
      <p className='fw-semibold'>Entrada</p>
      <textarea
        className='form-control font-monospace'
        rows={3}
        value={startInputText}
        onChange={event => setStartInputText(event.target.value)}
        disabled={state.timeSlot !== 0}
      />
    </div>
  )
}
