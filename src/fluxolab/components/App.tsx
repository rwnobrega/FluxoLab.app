import _ from 'lodash'

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
  const navbarWrapper = React.useRef<HTMLDivElement>(null)
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState<string>('100vh')

  const { nodes, edges } = useStoreFlow()
  const { machine, setFlowchart, setStartSymbolId, setCompileError } = useStoreMachine()
  const { state, setState, setStateHistory } = useStoreMachineState()

  const nodesDep = JSON.stringify(
    _.map(nodes, node => _.pick(node, ['id', 'type', 'data']))
  )
  const edgesDep = JSON.stringify(
    _.map(edges, edge => _.pick(edge, ['id', 'source', 'sourceHandle', 'target', 'targetHandle']))
  )

  useEffect(() => {
    const { flowchart, startSymbolId, error } = compile({ nodes, edges, variables: machine.variables })
    setStartSymbolId(startSymbolId)
    setFlowchart(flowchart)
    setCompileError(error)
  }, [nodesDep, edgesDep, machine.variables])

  useEffect(() => {
    resetMachineState(state)
    setStateHistory([])
    setState(state)
  }, [machine.flowchart, machine.startSymbolId])

  useEffect(() => {
    const navbarHeight = navbarWrapper.current?.offsetHeight ?? 0
    setContentHeight(`calc(100vh - ${navbarHeight}px)`)
  }, [])

  return (
    <Stack className='vh-100 h-100' style={{ userSelect: 'none' }}>
      <div ref={navbarWrapper}>
        <Navbar />
      </div>
      <Stack direction='horizontal' className='flex-fill align-items-stretch'>
        <div className='bg-light p-3'>
          <SymbolList />
        </div>
        <div style={{ width: '72%', height: contentHeight }} ref={reactFlowWrapper}>
          <Flow wrapper={reactFlowWrapper} />
        </div>
        <div style={{ width: '28%', height: contentHeight }} className='bg-light'>
          <div style={{ height: '40%' }} className='p-3'>
            <Variables />
          </div>
          <div style={{ height: '60%' }} className='p-3'>
            <Interaction />
          </div>
        </div>
      </Stack>
    </Stack>
  )
}
