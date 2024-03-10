import { v4 as uuid } from 'uuid'

import React, { useCallback, useState } from 'react'
import ReactFlow, { Background, Controls, EdgeTypes, MarkerType, NodeTypes } from 'reactflow'

import Stack from 'react-bootstrap/Stack'

import PlayButtons from 'components/PlayButtons'
import StatusMessage from 'components/StatusMessage'
import symbols from 'components/Symbols'

import MyEdge from './MyEdge'
import ConnectionLine from './MyEdge/ConnectionLine'
import MyNode from './MyNode'

import useStoreFlow from 'stores/storeFlow'

const edgeTypes: EdgeTypes = { smartEdge: MyEdge }

const nodeTypes: NodeTypes = {}
for (const { type, ...otherProps } of symbols) {
  nodeTypes[type] = ({ id }) => <MyNode nodeId={id} {...otherProps} />
}

interface Props {
  wrapper: React.RefObject<HTMLDivElement>
  refInput: React.RefObject<HTMLInputElement>
}

export default function ({ wrapper, refInput }: Props): JSX.Element {
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  const { nodes, edges, addNode, onNodesChange, onEdgesChange, onConnect } = useStoreFlow()

  const defaultEdgeOptions = {
    type: 'smartEdge',
    markerEnd: { type: MarkerType.ArrowClosed, height: 10, width: 6 }
  }

  const onDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    []
  )

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (wrapper === null || wrapper.current === null) return
      event.preventDefault()
      const { type, mouseX, mouseY } = JSON.parse(event.dataTransfer.getData('application/reactflow'))
      const id = uuid()
      const node = {
        id,
        type,
        position: reactFlowInstance.screenToFlowPosition({
          x: event.clientX - mouseX,
          y: event.clientY - mouseY
        }),
        data: { id, value: '' }
      }
      addNode(node)
    },
    [reactFlowInstance]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineComponent={ConnectionLine}
      onConnect={onConnect}
      onInit={setReactFlowInstance}
      onDrop={onDrop}
      onDragOver={onDragOver}
      multiSelectionKeyCode='Shift'
      selectionKeyCode='Control'
      deleteKeyCode='Delete'
      disableKeyboardA11y
      snapToGrid
      snapGrid={[20, 20]}
    >
      <Stack
        direction='horizontal' gap={3} className='position-absolute top-0 start-0 m-3'
        style={{ zIndex: 5, alignItems: 'start' }}
      >
        <PlayButtons refInput={refInput} />
        <StatusMessage />
      </Stack>
      <Controls />
      <Background gap={20} />
    </ReactFlow>
  )
}
