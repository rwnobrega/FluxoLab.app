import UseStoreFlowchart from "./useStoreFlowchart";
import _ from "lodash";
import { NodeChange } from "reactflow";

let historyBatchDepth: number = 0;
let historyBatchSaved: boolean = false;
let isDragging: boolean = false;
let removeBatchOpen: boolean = false;

const defer = (cb: () => void) => {
    if (typeof queueMicrotask === "function") return queueMicrotask(cb);
    Promise.resolve().then(cb);
};

export function beginRemoveHistoryBatch() {
    if (removeBatchOpen) return;
    removeBatchOpen = true;
    historyBatchDepth++;
    historyBatchSaved = false;

    defer(() => {
        historyBatchDepth--;
        if (!historyBatchDepth) historyBatchSaved = false;
        removeBatchOpen = false;
    });
}

export function saveHistory() {
    if (historyBatchDepth > 0) {
        if (historyBatchSaved) return;
        historyBatchSaved = true;
    }
    const { flowchart, history } = UseStoreFlowchart.getState();
    const newHistory = [...history, _.cloneDeep(flowchart)].slice(-30);
    UseStoreFlowchart.setState({ history: newHistory, future: [] });
}

export function handleChanges(changes: NodeChange[]) {
    const hasRemove = changes.some((c) => c.type === "remove");
    const hasPosition = changes.some(
        (c) => c.type === "position" && c.dragging !== undefined
    );

    if (hasPosition) {
        const dragStarting = changes.some(
            (c) => c.type === "position" && c.dragging === true
        );
        const dragEnding = changes.some(
            (c) => c.type === "position" && c.dragging === false
        );

        if (dragStarting && !isDragging) {
            isDragging = true;
            saveHistory();
        }
        if (dragEnding) isDragging = false;
    }
    if (hasRemove) {
        beginRemoveHistoryBatch();
        saveHistory();
    }
}

export function undo() {
    const { flowchart, history, future } = UseStoreFlowchart.getState();
    if (history.length == 0) return;

    const previousState = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const newFuture = [_.cloneDeep(flowchart), ...future];

    UseStoreFlowchart.setState({
        flowchart: _.cloneDeep(previousState),
        history: newHistory,
        future: newFuture,
    });
}

export function redo() {
    const { flowchart, history, future } = UseStoreFlowchart.getState();
    if (future.length == 0) return;

    const nextState = future[0];
    const newFuture = future.slice(1);
    const newHistory = [...history, _.cloneDeep(flowchart)];

    UseStoreFlowchart.setState({
        flowchart: _.cloneDeep(nextState),
        history: newHistory,
        future: newFuture,
    });
}