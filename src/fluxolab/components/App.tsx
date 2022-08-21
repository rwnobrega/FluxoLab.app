import React, { useEffect } from 'react'

import Stack from 'react-bootstrap/Stack'

import Flow from 'components/Flow'
import Navbar from 'components/Navbar'
import SymbolList from 'components/SymbolList'
import Variables from 'components/Variables'
import Interaction from 'components/Interaction'

import useStoreFlow from 'stores/storeFlow'
import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

import compile from 'machine/compiler'
import { resetMachineState } from 'machine/machine'

export default function (): JSX.Element {
  const { nodes, edges } = useStoreFlow()
  const { machine, setFlowchart, setStartSymbolId, setCompileError } = useStoreMachine()
  const { state, setState, setStateHistory } = useStoreMachineState()

  useEffect(() => {
    const { flowchart, startSymbolId, error } = compile({ nodes, edges, variables: machine.variables })
    setStartSymbolId(startSymbolId)
    setFlowchart(flowchart)
    setCompileError(error)
  }, [nodes, edges, machine.variables])

  useEffect(() => {
    resetMachineState(state)
    setStateHistory([])
    setState(state)
  }, [machine.flowchart, machine.startSymbolId])

  return (
    <Stack className='vh-100 h-100' style={{ userSelect: 'none' }}>
      <Navbar />
      <Stack direction='horizontal' className='flex-fill align-items-stretch'>
        <div className='bg-light p-3'>
          <SymbolList />
        </div>
        <div style={{ width: '100%' }}>
          <Flow />
        </div>
        <Stack style={{ width: '35%' }} className='bg-light p-3' gap={3}>
          <Variables />
          <Interaction />
        </Stack>
      </Stack>
    </Stack>
  )
}
