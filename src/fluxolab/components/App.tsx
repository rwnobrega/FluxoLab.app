import _ from 'lodash'

import React, { useEffect, useRef, useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import Stack from 'react-bootstrap/Stack'

import Flow from 'components/Flow'
import Navbar from 'components/Navbar'
import SymbolList from 'components/SymbolList'
import VariableList from 'components/VariableList'
import Interaction from 'components/Interaction'

import buttonList from 'components/PlayButtons/buttonList'

import useStoreFlow from 'stores/useStoreFlow'
import useStoreMachine from 'stores/useStoreMachine'
import useStoreMachineState from 'stores/useStoreMachineState'

import compile from 'machine/compiler'

import { palette } from 'utils/colors'

export default function (): JSX.Element {
  const navbarWrapper = useRef<HTMLDivElement>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const [contentHeight, setContentHeight] = useState<string>('100vh')

  const { nodes, edges, selectAll } = useStoreFlow()
  const { machine, setFlowchart, setStartSymbolId, compileErrors, setCompileErrors } = useStoreMachine()
  const { getState, reset, execAction } = useStoreMachineState()

  const state = getState()

  const nodesDep = JSON.stringify(
    _.map(nodes, node => _.pick(node, ['id', 'type', 'data']))
  )
  const edgesDep = JSON.stringify(
    _.map(edges, edge => _.pick(edge, ['id', 'source', 'sourceHandle', 'target', 'targetHandle']))
  )

  useEffect(() => {
    const { flowchart, startSymbolId, errors } = compile({ nodes, edges, variables: machine.variables })
    setStartSymbolId(startSymbolId)
    setFlowchart(flowchart)
    setCompileErrors(errors)
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

  for (const { action, hotkey, isDisabled } of buttonList) {
    useHotkeys(
      hotkey,
      () => {
        if (!isDisabled(state, compileErrors)) {
          execAction(action, machine)
        }
      },
      hotkeysOptions
    )
  }

  useHotkeys('ctrl+a', selectAll, hotkeysOptions)

  const resizeHandleStyle = {
    backgroundColor: palette.gray300,
    background: `repeating-linear-gradient(
      45deg,
      ${palette.gray300},
      ${palette.gray300} 2px,
      ${palette.gray100} 2px,
      ${palette.gray100} 4px
    )`

  }

  return (
    <Stack className='vh-100 h-100' style={{ userSelect: 'none' }}>
      <div ref={navbarWrapper}>
        <Navbar />
      </div>
      <PanelGroup direction='horizontal' autoSaveId='fluxolab_main'>
        <div className='bg-light p-3'>
          <SymbolList />
        </div>
        <Panel defaultSize={70} minSize={50}>
          <div ref={reactFlowWrapper} style={{ height: contentHeight }}>
            <Flow wrapper={reactFlowWrapper} />
          </div>
        </Panel>
        <PanelResizeHandle style={{ width: '6px', ...resizeHandleStyle }} />
        <Panel defaultSize={30} minSize={24}>
          <PanelGroup direction='vertical' autoSaveId='fluxolab_right' className='bg-light'>
            <Panel defaultSize={40} minSize={24} className='p-3'>
              <VariableList />
            </Panel>
            <PanelResizeHandle style={{ height: '6px', ...resizeHandleStyle }} />
            <Panel defaultSize={60} className='p-3'>
              <Interaction />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </Stack>
  )
}
