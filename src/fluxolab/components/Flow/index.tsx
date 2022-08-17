import { v4 as uuid } from 'uuid'

import React, { useCallback, useRef, useState } from 'react'
import ReactFlow, { Background, Controls, EdgeTypes, NodeTypes } from 'react-flow-renderer'

import ExecutionGroup from 'components/ExecutionGroup'
import StatusMessage from 'components/StatusMessage'
import symbols from 'components/Symbols'

import MyEdge from './MyEdge'
import MyNode from './MyNode'

import useStoreFlow from 'stores/storeFlow'

const edgeTypes: EdgeTypes = { smartEdge: MyEdge }

const nodeTypes: NodeTypes = {}
for (const { type, ...otherProps } of symbols) {
  nodeTypes[type] = ({ id }) => <MyNode nodeId={id} {...otherProps} />
}

export default function (): JSX.Element {
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const reactFlowWrapper = useRef<any>(null)

  const { nodes, edges, addNode, onNodesChange, onEdgesChange, onConnect } = useStoreFlow()

  const onDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    []
  )

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const id = uuid()
      const node = {
        id,
        type: event.dataTransfer.getData('application/reactflow'),
        position: reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top
        }),
        data: { id, value: '' }
      }
      addNode(node)
    },
    [reactFlowInstance]
  )

  return (
    <div ref={reactFlowWrapper} style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        multiSelectionKeyCode='Shift'
        selectionKeyCode='Control'
        deleteKeyCode='Delete'
        snapToGrid
        snapGrid={[20, 20]}
      >
        <div className='position-absolute top-0 start-0 m-3' style={{ zIndex: 5 }}>
          <ExecutionGroup />
        </div>
        <Controls />
        <Background gap={20} />
        <div className='position-absolute bottom-0 end-0 m-3' style={{ zIndex: 5 }}>
          <StatusMessage />
        </div>
      </ReactFlow>
    </div>
  )
}
