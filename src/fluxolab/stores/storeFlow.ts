import _ from 'lodash'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Connection, Edge, EdgeChange, Node, NodeChange, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'

interface StoreFlow {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  clearAll: () => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  addNode: (node: Node) => void
  deleteNode: (id: string) => void
  updateNodeProp: (id: string, path: string, value: any) => void
  onConnect: (connection: Connection) => void
  selectAll: () => void
  mouseOverNodeId: string | null
  setMouseOverNodeId: (id: string | null) => void
}

const useStoreFlow = create<StoreFlow, any>(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      setNodes: nodes => set({ nodes }),
      setEdges: edges => set({ edges }),
      clearAll: () => set({ nodes: [], edges: [] }),
      onNodesChange: changes => set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: changes => set({ edges: applyEdgeChanges(changes, get().edges) }),
      addNode: node => set({ nodes: [...get().nodes, node] }),
      deleteNode: id => set({
        nodes: _.filter(get().nodes, node => node.id !== id),
        edges: _.filter(get().edges, edge => edge.source !== id && edge.target !== id)
      }),
      updateNodeProp: (id, path, value) => {
        const nodes = get().nodes
        const node = _.find(nodes, { id }) as Node
        _.set(node, path, value)
        set({ nodes })
      },
      onConnect: connection => {
        const edges = get().edges
        _.remove(edges, edge => (edge.source === connection.source && edge.sourceHandle === connection.sourceHandle))
        set({ edges: addEdge(connection, edges) })
      },
      selectAll: () => {
        set({ nodes: _.map(get().nodes, node => ({ ...node, selected: true })) })
        set({ edges: _.map(get().edges, edge => ({ ...edge, selected: true })) })
      },
      mouseOverNodeId: null,
      setMouseOverNodeId: id => set({ mouseOverNodeId: id })
    }),
    {
      name: 'fluxolab_flow',
      version: 2
    }
  )
)

export default useStoreFlow
