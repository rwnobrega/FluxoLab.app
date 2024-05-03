import _ from "lodash";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  Viewport,
  XYPosition,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { VariableTypeId } from "~/core/variableTypes";

import { SimpleFlowchart } from "./serialize";

export interface Flowchart {
  title: string;
  variables: Array<{ id: string; type: VariableTypeId }>;
  nodes: Node[];
  edges: Edge[];
}

interface StoreFlowchart {
  flowchart: Flowchart;
  savedViewport: Viewport;
  clearFlowchart: () => void;
  importSimpleFlowchart: (simpleFlowchart: SimpleFlowchart) => void;
  setTitle: (title: string) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addNode: (type: string, position: XYPosition) => void;
  deleteNode: (id: string) => void;
  changeNodeData: (id: string, value: any) => void;
  onConnect: (connection: Connection) => void;
  addVariable: () => void;
  removeVariable: (id: string) => void;
  renameVariable: (id: string, newId: string) => void;
  changeVariableType: (id: string, type: VariableTypeId) => void;
  setSavedViewport: (viewport: Viewport) => void;
}

function getNextAvailableNodeId(nodes: Node[]): string {
  const intIds = _.map(nodes, (node) => parseInt(node.id));
  let i = 0;
  while (_.includes(intIds, i)) i++;
  return i.toString();
}

function getNextAvailableVariableId(variables: Array<{ id: string }>): string {
  const prefix = "var";
  let i = 1;
  while (true) {
    const id = `${prefix}${i}`;
    const allIds = _.map(variables, "id");
    if (!_.includes(allIds, id)) {
      return id;
    }
    i++;
  }
}

function getEmptyFlowchart(): Flowchart {
  return {
    title: "",
    variables: [],
    nodes: [],
    edges: [],
  };
}

const useStoreFlow = create<StoreFlowchart>()(
  persist(
    (set, get) => ({
      flowchart: getEmptyFlowchart(),
      savedViewport: { x: 0, y: 0, zoom: 1 },
      clearFlowchart: () => {
        set({ flowchart: getEmptyFlowchart() });
        set({ savedViewport: { x: 0, y: 0, zoom: 1 } });
      },
      importSimpleFlowchart: (simpleFlowchart) => {
        const { title, variables, nodes, edges } = simpleFlowchart;
        const edgesWithIds = _.map(edges, (edge, id) => ({
          ...edge,
          id: id.toString(),
        }));
        set({ flowchart: { title, variables, nodes, edges: edgesWithIds } });
      },
      setTitle: (title) => {
        const { flowchart } = get();
        flowchart.title = title;
        set({ flowchart });
      },
      onNodesChange: (changes) => {
        const { flowchart } = get();
        flowchart.nodes = applyNodeChanges(changes, flowchart.nodes);
        set({ flowchart });
      },
      onEdgesChange: (changes) => {
        const { flowchart } = get();
        flowchart.edges = applyEdgeChanges(changes, flowchart.edges);
        set({ flowchart });
      },
      addNode: (type, position) => {
        const { flowchart } = get();
        const id = getNextAvailableNodeId(flowchart.nodes);
        const newNode = { id, type, position, data: "" };
        flowchart.nodes = [...flowchart.nodes, newNode];
        set({ flowchart });
      },
      deleteNode: (id) => {
        const { flowchart } = get();
        flowchart.nodes = _.filter(flowchart.nodes, (node) => node.id !== id);
        flowchart.edges = _.filter(
          flowchart.edges,
          (edge) => edge.source !== id && edge.target !== id,
        );
        set({ flowchart });
      },
      changeNodeData: (id, value) => {
        const { flowchart } = get();
        const node = _.find(flowchart.nodes, { id }) as Node;
        _.set(node, "data", value);
        set({ flowchart });
      },
      onConnect: (connection) => {
        const { flowchart } = get();
        flowchart.edges = _.reject(
          flowchart.edges,
          (edge) =>
            edge.source === connection.source &&
            edge.sourceHandle === connection.sourceHandle,
        );
        flowchart.edges = addEdge(connection, flowchart.edges);
        set({ flowchart });
      },
      addVariable: () => {
        const { flowchart } = get();
        const id = getNextAvailableVariableId(flowchart.variables);
        flowchart.variables = [...flowchart.variables, { id, type: "number" }];
        set({ flowchart });
      },
      removeVariable: (id) => {
        const { flowchart } = get();
        flowchart.variables = _.reject(flowchart.variables, { id });
        set({ flowchart });
      },
      renameVariable: (id, newId) => {
        const { flowchart } = get();
        flowchart.variables = _.map(flowchart.variables, (variable) => {
          if (variable.id === id) {
            variable.id = newId;
          }
          return variable;
        });
        set({ flowchart });
      },
      changeVariableType: (id, type) => {
        const { flowchart } = get();
        flowchart.variables = _.map(flowchart.variables, (variable) => {
          if (variable.id === id) {
            variable.type = type;
          }
          return variable;
        });
        set({ flowchart });
      },
      setSavedViewport: (viewport) => set({ savedViewport: viewport }),
    }),
    {
      name: "fluxolab_flow",
      version: 6,
    },
  ),
);

export default useStoreFlow;
