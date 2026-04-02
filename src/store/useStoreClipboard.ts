import _ from "lodash";
import { Edge, Node } from "reactflow";
import { create } from "zustand";

import { NodeData } from "./useStoreFlowchart";
import useStoreFlowchart, { getNextAvailableNodeId } from "./useStoreFlowchart";

interface StoreClipboard {
  clipboard: { nodes: Node<NodeData>[]; edges: Edge[] };
  copyNodes: (ids: string[]) => void;
  pasteNodes: () => void;
  cutNodes: (ids: string[]) => void;
}

const useStoreClipboard = create<StoreClipboard>()((set, get) => ({
  clipboard: { nodes: [], edges: [] },

  copyNodes: (ids) => {
    const { flowchart } = useStoreFlowchart.getState();
    const nodes = [];
    for (const node of flowchart.nodes) {
      if (_.includes(ids, node.id)) {
        nodes.push(_.cloneDeep(node));
      }
    }
    const edges = [];
    for (const edge of flowchart.edges) {
      if (_.includes(ids, edge.source) && _.includes(ids, edge.target)) {
        edges.push(_.cloneDeep(edge));
      }
    }
    set({ clipboard: { nodes, edges } });
  },

  pasteNodes: () => {
    const { clipboard } = get();
    if (clipboard.nodes.length === 0) return;

    const { flowchart } = useStoreFlowchart.getState();

    // Reserva IDs novos sequencialmente sem colidir entre si
    const idMap: Record<string, string> = {};
    const tempNodes = _.cloneDeep(flowchart.nodes);
    for (const node of clipboard.nodes) {
      const id = getNextAvailableNodeId(tempNodes);
      idMap[node.id] = id;
      tempNodes.push({ ...node, id });
    }

    const newNodes: Node[] = [];
    for (const node of clipboard.nodes) {
      newNodes.push({
        ..._.cloneDeep(node),
        id: idMap[node.id],
        position: { x: node.position.x + 20, y: node.position.y + 20 },
        selected: true,
      });
    }

    const newEdges: Edge[] = [];
    for (const edge of clipboard.edges) {
      if (_.has(idMap, edge.source) && _.has(idMap, edge.target)) {
        const source = idMap[edge.source];
        const target = idMap[edge.target];
        newEdges.push({
          ..._.cloneDeep(edge),
          id: `${source}-${target}-${edge.sourceHandle}`,
          source,
          target,
          selected: true,
        });
      }
    }

    flowchart.nodes = [
      ..._.map(flowchart.nodes, (node) => ({ ...node, selected: false })),
      ...newNodes,
    ];
    flowchart.edges = [
      ..._.map(flowchart.edges, (edge) => ({ ...edge, selected: false })),
      ...newEdges,
    ];

    useStoreFlowchart.setState({ flowchart });
  },

  cutNodes: (ids) => {
    const { copyNodes } = get();
    const { deleteNode } = useStoreFlowchart.getState();
    copyNodes(ids);
    ids.forEach(deleteNode);
  },
}));

export default useStoreClipboard;
