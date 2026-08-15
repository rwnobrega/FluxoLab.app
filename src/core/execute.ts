import _ from "lodash";
import { Node } from "reactflow";

import grammar from "~/core/language/grammar";
import semantics from "~/core/language/semantics";
import { Flowchart, NodeData } from "~/store/useStoreFlowchart";
import { MachineState } from "~/store/useStoreMachine";
import assert from "~/utils/assert";

import { Role } from "./roles";

function getNodeById(flowchart: Flowchart, nodeId: string): Node<NodeData> {
  const node = _.find(flowchart.nodes, { id: nodeId });
  assert(node !== undefined);
  return node;
}

function getStartNode(flowchart: Flowchart): Node<NodeData> {
  const node = _.find(flowchart.nodes, { data: { role: Role.Start } });
  assert(node !== undefined);
  return node;
}

/**
 * Number of tokens a read block takes from the input queue: one per variable
 * it names. Its payload is a comma-separated list of identifiers, and an
 * identifier cannot contain a comma, so counting the separators is exact for
 * every payload the checker accepts.
 */
export function readArity(node: Node<NodeData>): number {
  return node.data.payload.split(",").length;
}

/**
 * Recomputes whether the machine can move from where it stands. Only a read
 * blocks, and only while the queue holds fewer tokens than it needs, so this
 * is what turns `waiting` into `running` when input arrives -- and back again
 * if the queue is emptied. Any other status (`ready`, `halted`, `exception`,
 * `invalid`) is left alone: it does not depend on the queue.
 */
export function refreshStatus(
  flowchart: Flowchart,
  state: MachineState,
): MachineState {
  if (state.status !== "running" && state.status !== "waiting") return state;
  if (state.curNodeId === null) return state;
  const node = getNodeById(flowchart, state.curNodeId);
  if (node.data.role !== Role.Read) return state;
  const status: MachineState["status"] =
    state.inputBuffer.length >= readArity(node) ? "running" : "waiting";
  return { ...state, status };
}

function getOutgoingEdge(
  sourceId: string,
  handleId: string,
  flowchart: Flowchart,
): string {
  const edge = _.find(flowchart.edges, {
    source: sourceId,
    sourceHandle: handleId,
  });
  assert(edge !== undefined);
  return edge.target;
}

export default function (
  flowchart: Flowchart,
  state: MachineState,
): MachineState {
  state = _.cloneDeep(state);

  const node =
    state.curNodeId === null
      ? getStartNode(flowchart)
      : getNodeById(flowchart, state.curNodeId);

  try {
    const prefix = node.data.role;
    const matchResult = grammar.match(
      `${prefix} ${node.data.payload}`,
      "Command",
    );
    semantics(matchResult).exec(state);
    state.status = "running";
    state.timeSlot += 1;
  } catch (error) {
    // Runtime errors are thrown as `{ message, payload }`, where `message` is
    // a key into the string table. A real `Error` reaching this point is a bug
    // in FluxoLab itself, and its message must not be shown as if it were one
    // of ours.
    const isLanguageError = !(error instanceof Error);
    state.status = "exception";
    state.errors = [
      {
        type: "runtime",
        nodeId: node.id,
        message: isLanguageError ? error.message : "RuntimeError_Internal",
        payload: isLanguageError ? error.payload : { details: String(error) },
      },
    ];
    return state;
  }

  assert(state.outPort !== null);
  state.curNodeId = getOutgoingEdge(node.id, state.outPort, flowchart);
  const nextNode = getNodeById(flowchart, state.curNodeId);
  if (nextNode.data.role === Role.End) {
    state.status = "halted";
    return state;
  }
  // Arriving at a read no longer stops the machine by itself: it stops only if
  // the queue cannot answer it.
  return refreshStatus(flowchart, state);
}
