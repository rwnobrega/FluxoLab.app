import _ from "lodash";
import { Node } from "reactflow";

import { BlockTypeId, getBlockType } from "~/core/blockTypes";
import { getExpectedText } from "~/core/language/errors";
import grammar from "~/core/language/grammar";
import semantics from "~/core/language/semantics";
import { Flowchart, NodeData } from "~/store/useStoreFlowchart";
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

  if (startNodes.length === 0) {
    errors.push({
      type: "check",
      message: "CheckError_NoStart",
      nodeId: null,
    });
  }
  if (startNodes.length > 1) {
    errors.push({
      type: "check",
      message: "CheckError_MultipleStart",
      nodeId: null,
    });
  }

  for (const node of nodes) {
    const blockType = getBlockType(node.type as BlockTypeId);
    for (const handle of blockType.handles) {
      const outgoingEdges = _.filter(edges, {
        source: node.id,
        sourceHandle: handle.id,
      });
      if (outgoingEdges.length === 0) {
        const output = handle.label ?? "out";
        errors.push({
          type: "check",
          message:
            output === "out"
              ? "CheckError_NoOutgoing_Default"
              : "CheckError_NoOutgoing_Handle",
          nodeId: node.id,
          payload: { output },
        });
      }
    }
  }

  return errors;
}

function checkNode(flowchart: Flowchart, node: Node<NodeData>): MachineError[] {
  const { variables } = flowchart;
  const errors: MachineError[] = [];

  const blockType = getBlockType(node.type as BlockTypeId);
  const { prefixCommand } = blockType;

  const matchResult = grammar.match(
    `${prefixCommand}${node.data.payload}`,
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
    const error = semantics(matchResult).check(variables);
    if (error) {
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
