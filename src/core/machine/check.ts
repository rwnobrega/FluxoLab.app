import _ from "lodash";
import { Node } from "reactflow";

import { BlockTypeId, getBlockType } from "~/core/blockTypes";
import { getExpectedText } from "~/core/language/errors";
import grammar from "~/core/language/grammar";
import semantics from "~/core/language/semantics";
import { Flowchart } from "~/store/useStoreFlowchart";
import { MachineError } from "~/store/useStoreMachine";

export default function (flowchart: Flowchart): MachineError[] {
  const errors: MachineError[] = [];
  errors.push(...checkGraph(flowchart));
  for (const node of _.reject(flowchart.nodes, { type: "end" })) {
    errors.push(...checkNode(flowchart, node));
  }
  return errors;
}

function checkGraph(flowchart: Flowchart): MachineError[] {
  const { nodes, edges } = flowchart;
  const errors: MachineError[] = [];
  const startNodes = _.filter(nodes, { type: "start" });

  // Check if there is a start node
  if (startNodes.length === 0) {
    errors.push({
      type: "check",
      message: "CheckError_NoStart",
      nodeId: null,
    });
  }
  // Check if there are multiple start nodes
  if (startNodes.length > 1) {
    errors.push({
      type: "check",
      message: "CheckError_MultipleStart",
      nodeId: null,
    });
  }

  // Check for handles with no outgoing edges
  for (const node of nodes) {
    const blockType = getBlockType(node.type as BlockTypeId);
    for (const handle of _.filter(blockType.handles, { type: "source" })) {
      const outgoingEdges = _.filter(edges, {
        source: node.id,
        sourceHandle: handle.id,
      });
      if (outgoingEdges.length === 0) {
        errors.push({
          type: "check",
          message:
            handle.label === undefined
              ? "CheckError_NoOutgoing_Default"
              : "CheckError_NoOutgoing_Handle",
          nodeId: node.id,
          payload: { output: handle.label as string },
        });
      }
    }
  }

  return errors;
}

function checkNode(flowchart: Flowchart, node: Node): MachineError[] {
  const { variables } = flowchart;
  const errors: MachineError[] = [];

  const blockType = getBlockType(node.type as BlockTypeId);
  const { prefixCommand } = blockType;

  const matchResult = grammar.match(
    `${prefixCommand}${node.data}`,
    `Command_${node.type}`,
  );
  if (matchResult.failed()) {
    errors.push({
      type: "syntax",
      message: "SyntaxError",
      nodeId: node.id,
      payload: {
        pos: matchResult.getInterval().startIdx - prefixCommand.length,
        expected: getExpectedText(matchResult),
      },
    });
  } else {
    for (const error of semantics(matchResult).check(variables)) {
      errors.push({
        type: "check",
        message: error.message,
        nodeId: node.id,
        payload: error.payload,
      });
    }
  }
  return errors;
}
