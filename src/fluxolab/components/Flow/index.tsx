import { v4 as uuid } from 'uuid'

import React, { useCallback, useState } from 'react'
import ReactFlow, { Background, Controls, EdgeTypes, NodeTypes } from 'react-flow-renderer'

import PlayButtons from 'components/PlayButtons'
import StatusMessage from 'components/StatusMessage'
import symbols from 'components/symbols'

import MyEdge from './MyEdge'
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
      const reactFlowBounds = wrapper.current.getBoundingClientRect()
      const id = uuid()
      const node = {
        id,
        type,
        position: reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left - mouseX,
          y: event.clientY - reactFlowBounds.top - mouseY
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
        <PlayButtons refInput={refInput} />
      </div>
      <Controls />
      <Background gap={20} />
      <div className='position-absolute bottom-0 end-0 m-3' style={{ zIndex: 5 }}>
        <StatusMessage />
      </div>
    </ReactFlow>
  )
}
