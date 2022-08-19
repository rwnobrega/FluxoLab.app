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
  updateNodeValue: (id: string, value: string) => void
  edges: Edge[]
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  startInputText: string
  setStartInputText: (input: string) => void
}

const useStoreFlow = create<StoreFlow, any>(
  persist(
    (set, get) => ({
      nodes: [],
      addNode: node => set(state => ({ ...state, nodes: [...state.nodes, node] })),
      onNodesChange: changes => {
        set({ nodes: applyNodeChanges(changes, get().nodes) })
      },
      updateNodeValue: (id, value) => {
        set({
          nodes: get().nodes.map(node => {
            if (node.id === id) {
              node.data = { ...node.data, value }
            }
            return node
          })
        })
      },
      edges: [],
      onEdgesChange: changes => {
        set({ edges: applyEdgeChanges(changes, get().edges) })
      },
      onConnect: connection => {
        set({ edges: addEdge({ ...connection, type: 'smartEdge' }, get().edges) })
      },
      startInputText: '',
      setStartInputText: input => set({ startInputText: input })
    }),
    {
      name: 'fluxolab_flow',
      version: 1
    }
  )
)

export default useStoreFlow
