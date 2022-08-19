import _ from 'lodash'

import create from 'zustand'

import { persist } from 'zustand/middleware'

import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges
} from 'react-flow-renderer'

interface StoreFlow {
  nodes: Node[]
  addNode: (node: Node) => void
  onNodesChange: (changes: NodeChange[]) => void
  updateNodeProp: (id: string, path: string, value: any) => void
  edges: Edge[]
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
}

const useStoreFlow = create<StoreFlow, any>(
  persist(
    (set, get) => ({
      nodes: [],
      addNode: node => set({ nodes: [...get().nodes, node] }),
      onNodesChange: changes => set({ nodes: applyNodeChanges(changes, get().nodes) }),
      updateNodeProp: (id, path, value) => {
        set({
          nodes: get().nodes.map(node => {
            if (node.id === id) {
              _.set(node, path, value)
            }
            return node
          })
        })
      },
      edges: [],
      onEdgesChange: changes => set({ edges: applyEdgeChanges(changes, get().edges) }),
      onConnect: connection => {
        const edges = get().edges
        _.remove(edges, edge => edge.source === connection.source)
        set({ edges: addEdge({ ...connection, type: 'smartEdge' }, edges) })
      }
    }),
    {
      name: 'fluxolab_flow',
      version: 1
    }
  )
)

export default useStoreFlow
