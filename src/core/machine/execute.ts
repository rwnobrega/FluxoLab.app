import { cloneDeep } from "lodash";
import { Node } from "reactflow";

import grammar from "~/core/language/grammar";
import semantics from "~/core/language/semantics";
import { Flowchart } from "~/store/useStoreFlowchart";
import { MachineState } from "~/store/useStoreMachine";

function getNodeById(flowchart: Flowchart, nodeId: string): Node {
  const node = flowchart.nodes.find((n) => n.id === nodeId);
  if (node === undefined) throw new Error(`Node not found: ${nodeId}`);
  return node;
}

function getStartNode(flowchart: Flowchart): Node {
  const node = flowchart.nodes.find((n) => n.type === "start");
  if (node === undefined) throw new Error("Start node not found");
  return node;
}

function getOutgoingEdge(
  sourceId: string,
  handleId: string,
  flowchart: Flowchart,
): string {
  const edge = flowchart.edges.find(
    (e) => e.source === sourceId && e.sourceHandle === handleId,
  );
  if (edge === undefined)
    throw new Error(`Edge not found: ${sourceId}, ${handleId}`);
  return edge.target;
}

export default function (
  flowchart: Flowchart,
  state: MachineState,
): MachineState {
  state = cloneDeep(state);

  const node =
    state.curNodeId === null
      ? getStartNode(flowchart)
      : getNodeById(flowchart, state.curNodeId);

  const command = (() => {
    if (node.type === "assignment") {
      return node.data;
    } else {
      return `${node.type} ${node.data}`;
    }
  })();

  try {
    const matchResult = grammar.match(command, "Command");
    semantics(matchResult).eval(state);
    state.status = "running";
    state.timeSlot += 1;
  } catch (error) {
    state.status = "exception";
    state.errors = [
      {
        type: "runtime",
        nodeId: node.id,
        message: error.message,
        payload: error.payload,
      },
    ];
    return state;
  }

  if (state.outPort === null) throw new Error("Output port not set");
  state.curNodeId = getOutgoingEdge(node.id, state.outPort, flowchart);
  const nextNode = getNodeById(flowchart, state.curNodeId);
  if (nextNode.type === "end" && state.status === "running") {
    state.status = "halted";
  } else if (nextNode.type === "read" && state.status === "running") {
    state.status = "waiting";
  }

  return state;
}
