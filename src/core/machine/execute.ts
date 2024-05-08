import _ from "lodash";
import { Node } from "reactflow";

import grammar from "~/core/language/grammar";
import semantics from "~/core/language/semantics";
import { Flowchart, NodeData } from "~/store/useStoreFlowchart";
import { MachineState } from "~/store/useStoreMachine";
import assert from "~/utils/assert";

import { BlockTypeId, getBlockType } from "../blockTypes";

function getNodeById(flowchart: Flowchart, nodeId: string): Node<NodeData> {
  const node = _.find(flowchart.nodes, { id: nodeId });
  assert(node !== undefined);
  return node;
}

function getStartNode(flowchart: Flowchart): Node<NodeData> {
  const node = _.find(flowchart.nodes, { type: "start" });
  assert(node !== undefined);
  return node;
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

  const blockType = getBlockType(node.type as BlockTypeId);
  const { prefixCommand } = blockType;

  try {
    const matchResult = grammar.match(
      `${prefixCommand}${node.data.payload}`,
      `Command_${node.type}`,
    );
    semantics(matchResult).exec(state);
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

  assert(state.outPort !== null);
  state.curNodeId = getOutgoingEdge(node.id, state.outPort, flowchart);
  const nextNode = getNodeById(flowchart, state.curNodeId);
  if (nextNode.type === "end" && state.status === "running") {
    state.status = "halted";
  } else if (nextNode.type === "read" && state.status === "running") {
    state.status = "waiting";
  }

  return state;
}
