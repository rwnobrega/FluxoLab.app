import _ from "lodash";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  Viewport,
  XYPosition,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

interface StoreFlow {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  makeConnections: (connections: Connection[]) => void;
  clearAll: () => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addNode: (type: string, position: XYPosition) => void;
  deleteNode: (id: string) => void;
  updateNodeProp: (id: string, path: string, value: any) => void;
  onConnect: (connection: Connection) => void;
  selectAll: () => void;
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
}

function getNextAvailableId(nodes: Node[]): string {
  const intIds = _.map(nodes, (node) => parseInt(node.id));
  let i = 0;
  while (_.includes(intIds, i)) i++;
  return i.toString();
}

const useStoreFlow = create<StoreFlow>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      setNodes: (nodes) => set({ nodes }),
      makeConnections: (connections) => {
        for (const connection of connections) {
          set({ edges: addEdge(connection, get().edges) });
        }
      },
      clearAll: () =>
        set({ nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } }),
      onNodesChange: (changes) =>
        set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) =>
        set({ edges: applyEdgeChanges(changes, get().edges) }),
      addNode: (type, position) => {
        const nodes = get().nodes;
        const id = getNextAvailableId(nodes);
        const newNode = { id, type, position, data: "" };
        set({ nodes: [...nodes, newNode] });
      },
      deleteNode: (id) =>
        set({
          nodes: _.filter(get().nodes, (node) => node.id !== id),
          edges: _.filter(
            get().edges,
            (edge) => edge.source !== id && edge.target !== id,
          ),
        }),
      updateNodeProp: (id, path, value) => {
        const nodes = get().nodes;
        const node = _.find(nodes, { id }) as Node;
        _.set(node, path, value);
        set({ nodes });
      },
      onConnect: (connection) => {
        const edges = get().edges;
        _.remove(
          edges,
          (edge) =>
            edge.source === connection.source &&
            edge.sourceHandle === connection.sourceHandle,
        );
        set({ edges: addEdge(connection, edges) });
      },
      selectAll: () => {
        set({
          nodes: _.map(get().nodes, (node) => ({ ...node, selected: true })),
        });
        set({
          edges: _.map(get().edges, (edge) => ({ ...edge, selected: true })),
        });
      },
      viewport: { x: 0, y: 0, zoom: 1 },
      setViewport: (viewport) => set({ viewport }),
    }),
    {
      name: "fluxolab_flow",
      version: 6,
    },
  ),
);

export default useStoreFlow;
