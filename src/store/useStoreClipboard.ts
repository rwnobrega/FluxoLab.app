import _ from "lodash";
import { Edge, Node } from "reactflow";
import { create } from "zustand";

import { Flowchart, NodeData } from "./useStoreFlowchart";
import useStoreFlowchart, { getNextAvailableNodeId } from "./useStoreFlowchart";

interface StoreClipboard {
  clipboard: { nodes: Node<NodeData>[]; edges: Edge[] };
  copyNodes: (ids: string[]) => void;
  pasteNodes: () => void;
  cutNodes: (ids: string[]) => void;
  selectAll: () => void;
}

const useStoreClipboard = create<StoreClipboard>()((set, get) => ({
  clipboard: { nodes: [], edges: [] },

  copyNodes: (ids) => {
    const { flowchart } = useStoreFlowchart.getState();
    const idSet = new Set(ids);
    const copiedNodes = flowchart.nodes
      .filter((n) => idSet.has(n.id))
      .map((n) => _.cloneDeep(n));
    const copiedEdges = flowchart.edges
      .filter((e) => idSet.has(e.source) && idSet.has(e.target))
      .map((e) => _.cloneDeep(e));
    set({ clipboard: { nodes: copiedNodes, edges: copiedEdges } });
  },

  pasteNodes: () => {
    const { clipboard } = get();
    if (clipboard.nodes.length === 0) return;

    const { flowchart, history } = useStoreFlowchart.getState();
    const newHistory: Flowchart[] = [...history, _.cloneDeep(flowchart)].slice(-50);

    // Reserva IDs novos sequencialmente sem colidir entre si
    const idMap = new Map<string, string>();
    const tempNodes = [...flowchart.nodes];
    clipboard.nodes.forEach((n) => {
      const newId = getNextAvailableNodeId(tempNodes);
      idMap.set(n.id, newId);
      tempNodes.push({ ...n, id: newId });
    });

    const newNodes: Node<NodeData>[] = clipboard.nodes.map((n) => ({
      ..._.cloneDeep(n),
      id: idMap.get(n.id)!,
      position: { x: n.position.x + 30, y: n.position.y + 30 },
      selected: true,
    }));

    const newEdges: Edge[] = clipboard.edges
      .filter((e) => idMap.has(e.source) && idMap.has(e.target))
      .map((e) => ({
        ..._.cloneDeep(e),
        id: `${idMap.get(e.source)}-${idMap.get(e.target)}-${e.sourceHandle}`,
        source: idMap.get(e.source)!,
        target: idMap.get(e.target)!,
        selected: true,
      }));

    flowchart.nodes = [
      ...flowchart.nodes.map((n) => ({ ...n, selected: false })),
      ...newNodes,
    ];
    flowchart.edges = [
      ...flowchart.edges.map((e) => ({ ...e, selected: false })),
      ...newEdges,
    ];

    useStoreFlowchart.setState({ flowchart, history: newHistory, future: [] });
  },

  cutNodes: (ids) => {
    const { copyNodes } = get();
    const { deleteNode, batchHistory } = useStoreFlowchart.getState();
    copyNodes(ids);
    batchHistory(() => {
      ids.forEach((id) => deleteNode(id));
    });
  },

  selectAll: () => {
    const { flowchart } = useStoreFlowchart.getState();
    flowchart.nodes = flowchart.nodes.map((n) => ({ ...n, selected: true }));
    flowchart.edges = flowchart.edges.map((e) => ({ ...e, selected: true }));
    useStoreFlowchart.setState({ flowchart });
  },
}));

export default useStoreClipboard;
