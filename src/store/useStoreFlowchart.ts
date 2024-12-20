import _ from "lodash";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  Position,
  Viewport,
  XYPosition,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DataType } from "~/core/dataTypes";
import { Role, getRoleHandles } from "~/core/roles";
import assert from "~/utils/assert";

import { SimpleFlowchart } from "./serialize";

export interface NodeData {
  role: Role;
  payload: string;
  handlePositions: Record<string, Position>;
}

export interface Flowchart {
  title: string;
  variables: Array<{ id: string; type: DataType }>;
  nodes: Node<NodeData>[];
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
  addNode: (role: Role, position: XYPosition) => void;
  deleteNode: (id: string) => void;
  changeNodePayload: (id: string, value: any) => void;
  addEdge: (connection: Connection) => void;
  moveHandle(connection: Connection): void;
  addVariable: () => void;
  removeVariable: (id: string) => void;
  renameVariable: (id: string, newId: string) => void;
  changeVariableType: (id: string, type: DataType) => void;
  reorderVariables: (fromIndex: number, toIndex: number | undefined) => void;
  setSavedViewport: (viewport: Viewport) => void;
}

function getNextAvailableNodeId(nodes: Node<NodeData>[]): string {
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

function getDefaultFlowchart(): Flowchart {
  return { title: "", variables: [], nodes: [], edges: [] };
}

function getDefaultViewport(): Viewport {
  return { x: 0, y: 0, zoom: 1 };
}

const useStoreFlowchart = create<StoreFlowchart>()(
  persist(
    (set, get) => ({
      flowchart: getDefaultFlowchart(),
      savedViewport: getDefaultViewport(),
      clearFlowchart: () => {
        set({
          flowchart: getDefaultFlowchart(),
          savedViewport: getDefaultViewport(),
        });
      },
      importSimpleFlowchart: (simpleFlowchart) => {
        const {
          title,
          variables,
          nodes: nodes0,
          edges: edges0,
        } = simpleFlowchart;
        const edges = _.map(edges0, ({ source, target, sourceHandle }) => ({
          id: `${source}-${target}-${sourceHandle}`,
          source,
          target,
          sourceHandle,
        }));
        const nodes = _.map(
          nodes0,
          ({ id, role, position, payload, handlePositions }) => ({
            id,
            type: "MyNode",
            position,
            data: { payload, role, handlePositions },
          }),
        );
        const flowchart = { title, variables, nodes, edges };
        set({ flowchart, savedViewport: getDefaultViewport() });
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
      addNode: (role, position) => {
        const { flowchart } = get();
        const handles = getRoleHandles(role);
        const newNode = {
          id: getNextAvailableNodeId(flowchart.nodes),
          type: "MyNode",
          position,
          data: {
            payload: "",
            role,
            handlePositions: _.fromPairs(
              _.map(handles, ({ id, position }) => [id, position]),
            ),
          },
        };
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
      changeNodePayload: (id, value) => {
        const { flowchart } = get();
        const node = _.find(flowchart.nodes, { id });
        assert(node !== undefined);
        node.data.payload = value;
        set({ flowchart });
      },
      addEdge: (connection) => {
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
      moveHandle: (connection) => {
        const { flowchart } = get();
        const id = connection.source as string;
        const handle = connection.sourceHandle as Position;
        const position = connection.targetHandle as Position;
        const node = _.find(flowchart.nodes, { id });
        assert(node !== undefined);
        node.data.handlePositions[handle] = position;
        set({ flowchart });
      },
      addVariable: () => {
        const { flowchart } = get();
        const id = getNextAvailableVariableId(flowchart.variables);
        flowchart.variables = [
          ...flowchart.variables,
          { id, type: DataType.Number },
        ];
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
      reorderVariables: (fromIndex, toIndex) => {
        if (toIndex === undefined || fromIndex === toIndex) return;
        const { flowchart } = get();
        const variable = flowchart.variables[fromIndex];
        flowchart.variables.splice(fromIndex, 1);
        flowchart.variables.splice(toIndex, 0, variable);
        set({ flowchart });
      },
      setSavedViewport: (viewport) => set({ savedViewport: viewport }),
    }),
    {
      name: "fluxolab_flow",
      version: 8,
    },
  ),
);

export default useStoreFlowchart;
