import create from 'zustand'

import { persist } from 'zustand/middleware'

import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges
} from 'react-flow-renderer'

interface StoreFlow {
  nodes: Node[]
  setNodes: (nodes: Node[]) => void
  onNodesChange: OnNodesChange
  addNode: (node: Node) => void
  updateNodeValue: (id: string, value: string) => void
  edges: Edge[]
  setEdges: (edges: Edge[]) => void
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  startInputText: string
  setStartInputText: (input: string) => void
}

const useStoreFlow = create<StoreFlow, any>(
  persist(
    (set, get) => ({
      nodes: [],
      setNodes: nodes => { set({ nodes }) },
      onNodesChange: (changes: NodeChange[]) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) })
      },
      addNode: node => set(state => ({ ...state, nodes: [...state.nodes, node] })),
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
      setEdges: edges => { set({ edges }) },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({ edges: applyEdgeChanges(changes, get().edges) })
      },
      onConnect: (connection: Connection) => {
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
