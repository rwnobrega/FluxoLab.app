import _ from 'lodash'

import React, { useEffect } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import Stack from 'react-bootstrap/Stack'

import Flow from 'components/Flow'
import Navbar from 'components/Navbar'
import SymbolList from 'components/SymbolList'
import VariableList from 'components/VariableList'
import Interaction from 'components/Interaction'

import buttonList from 'components/PlayButtons/buttonList'

import useStoreFlow from 'stores/storeFlow'
import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

import compile from 'machine/compiler'

export default function (): JSX.Element {
  const navbarWrapper = React.useRef<HTMLDivElement>(null)
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null)
  const refInput = React.useRef<HTMLInputElement>(null)

  const [contentHeight, setContentHeight] = React.useState<string>('100vh')

  const { nodes, edges, selectAll } = useStoreFlow()
  const { machine, setFlowchart, setStartSymbolId, compileError, setCompileError } = useStoreMachine()
  const { reset, execAction } = useStoreMachineState()

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
    reset(machine)
  }, [machine.flowchart, machine.startSymbolId])

  useEffect(() => {
    const navbarHeight = navbarWrapper.current?.offsetHeight ?? 0
    setContentHeight(`calc(100vh - ${navbarHeight}px)`)
  }, [])

  const hotkeysOptions: Parameters<typeof useHotkeys>[2] = {
    filter: event => {
      event.preventDefault()
      return true
    },
    enableOnTags: ['INPUT', 'TEXTAREA']
  }

  for (const { action, hotkey } of buttonList) {
    useHotkeys(
      hotkey,
      () => {
        if (compileError === null) {
          execAction(action, machine, refInput)
        }
      },
      hotkeysOptions
    )
  }

  useHotkeys('ctrl+a', selectAll, hotkeysOptions)

  return (
    <Stack className='vh-100 h-100' style={{ userSelect: 'none' }}>
      <div ref={navbarWrapper}>
        <Navbar />
      </div>
      <Stack direction='horizontal' className='flex-fill align-items-stretch'>
        <div className='bg-light p-3'>
          <SymbolList />
        </div>
        <div style={{ width: '70%', height: contentHeight }} ref={reactFlowWrapper}>
          <Flow wrapper={reactFlowWrapper} refInput={refInput} />
        </div>
        <div style={{ width: '30%', height: contentHeight }} className='bg-light'>
          <div style={{ height: '40%' }} className='p-3'>
            <VariableList />
          </div>
          <div style={{ height: '60%' }} className='p-3'>
            <Interaction refInput={refInput} />
          </div>
        </div>
      </Stack>
    </Stack>
  )
}
