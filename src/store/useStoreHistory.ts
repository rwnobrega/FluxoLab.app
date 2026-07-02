import _ from "lodash";
import { NodeChange } from "reactflow";
import { create } from "zustand";

import useStoreFlowchart, { Flowchart } from "./useStoreFlowchart";

const MAX_HISTORY_LENGTH = 30;

// Transient (non-reactive) state
let isBatching = false;
let isDragging = false;

interface StoreHistory {
  history: Flowchart[];
  future: Flowchart[];
  saveHistory: () => void;
  handleNodeChanges: (changes: NodeChange[]) => void;
  undo: () => void;
  redo: () => void;
}

const useStoreHistory = create<StoreHistory>()((set, get) => ({
  history: [],
  future: [],

  saveHistory: () => {
    // Multiple calls within the same microtask (e.g., removing nodes and
    // edges in a single gesture) are batched into a single snapshot.
    if (isBatching) return;
    isBatching = true;
    queueMicrotask(() => {
      isBatching = false;
    });

    const { history } = get();
    const { flowchart } = useStoreFlowchart.getState();
    set({
      history: [...history, _.cloneDeep(flowchart)].slice(-MAX_HISTORY_LENGTH),
      future: [],
    });
  },

  handleNodeChanges: (changes) => {
    const { saveHistory } = get();
    if (_.some(changes, (change) => change.type === "remove")) {
      saveHistory();
    }
    const dragStarting = _.some(
      changes,
      (change) => change.type === "position" && change.dragging === true,
    );
    const dragEnding = _.some(
      changes,
      (change) => change.type === "position" && change.dragging === false,
    );
    if (dragStarting && !isDragging) {
      isDragging = true;
      saveHistory();
    }
    if (dragEnding) {
      isDragging = false;
    }
  },

  undo: () => {
    const { history, future } = get();
    if (history.length === 0) return;
    const { flowchart } = useStoreFlowchart.getState();
    set({
      history: history.slice(0, -1),
      future: [_.cloneDeep(flowchart), ...future],
    });
    useStoreFlowchart.setState({ flowchart: _.cloneDeep(_.last(history)) });
  },

  redo: () => {
    const { history, future } = get();
    if (future.length === 0) return;
    const { flowchart } = useStoreFlowchart.getState();
    set({
      history: [...history, _.cloneDeep(flowchart)],
      future: future.slice(1),
    });
    useStoreFlowchart.setState({ flowchart: _.cloneDeep(future[0]) });
  },
}));

export default useStoreHistory;
