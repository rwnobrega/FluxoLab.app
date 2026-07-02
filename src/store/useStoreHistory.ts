import _ from "lodash";
import { NodeChange } from "reactflow";
import { create } from "zustand";

import { simplify } from "./serialize";
import useStoreFlowchart, { Flowchart } from "./useStoreFlowchart";

const MAX_HISTORY_LENGTH = 30;

function isSameFlowchart(a: Flowchart, b: Flowchart): boolean {
  return _.isEqual(simplify(a), simplify(b));
}

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
    const last = _.last(history);
    set({
      history:
        last !== undefined && isSameFlowchart(last, flowchart)
          ? history
          : [...history, _.cloneDeep(flowchart)].slice(-MAX_HISTORY_LENGTH),
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
    const { flowchart } = useStoreFlowchart.getState();
    // Discard trailing snapshots identical to the current state; they come
    // from actions that ended up not changing anything (e.g., a micro-drag
    // that snapped back to the same grid cell) and would make undo a no-op.
    const past = _.dropRightWhile(history, (snapshot) =>
      isSameFlowchart(snapshot, flowchart),
    );
    if (past.length === 0) {
      set({ history: past });
      return;
    }
    set({
      history: past.slice(0, -1),
      future: [_.cloneDeep(flowchart), ...future],
    });
    useStoreFlowchart.setState({ flowchart: _.cloneDeep(_.last(past)) });
  },

  redo: () => {
    const { history, future } = get();
    const { flowchart } = useStoreFlowchart.getState();
    // Symmetric to undo: skip snapshots identical to the current state.
    const next = _.dropWhile(future, (snapshot) =>
      isSameFlowchart(snapshot, flowchart),
    );
    if (next.length === 0) {
      set({ future: next });
      return;
    }
    set({
      history: [...history, _.cloneDeep(flowchart)],
      future: next.slice(1),
    });
    useStoreFlowchart.setState({ flowchart: _.cloneDeep(next[0]) });
  },
}));

export default useStoreHistory;
