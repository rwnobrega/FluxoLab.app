import _ from 'lodash'

import { create } from 'zustand'

import { persist } from 'zustand/middleware'

import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType
} from 'reactflow'

interface StoreFlow {
  nodes: Node[]
  edges: Edge[]
  clearAll: () => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  addNode: (node: Node) => void
  deleteNode: (id: string) => void
  updateNodeProp: (id: string, path: string, value: any) => void
  onConnect: (connection: Connection) => void
  selectAll: () => void
}

const useStoreFlow = create<StoreFlow, any>(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      clearAll: () => {
        set({ nodes: [], edges: [] })
      },
      onNodesChange: changes => set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: changes => set({ edges: applyEdgeChanges(changes, get().edges) }),
      addNode: node => set({ nodes: [...get().nodes, node] }),
      deleteNode: id => set({ nodes: _.filter(get().nodes, node => node.id !== id) }),
      updateNodeProp: (id, path, value) => {
        const nodes = get().nodes
        const node = _.find(nodes, { id })
        if (node === undefined) throw new Error('Node not found')
        _.set(node, path, value)
        set({ nodes })
      },
      onConnect: connection => {
        const edges = get().edges
        _.remove(edges, edge => (edge.source === connection.source && edge.sourceHandle === connection.sourceHandle))
        const edgeProps = {
          type: 'smartEdge',
          markerEnd: { type: MarkerType.ArrowClosed, height: 10, width: 6 }
        }
        set({ edges: addEdge({ ...connection, ...edgeProps }, edges) })
      },
      selectAll: () => {
        const nodes = get().nodes
        set({ nodes: _.map(nodes, node => ({ ...node, selected: true })) })
        const edges = get().edges
        set({ edges: _.map(edges, edge => ({ ...edge, selected: true })) })
      }
    }),
    {
      name: 'fluxolab_flow',
      version: 1
    }
  )
)

export default useStoreFlow
