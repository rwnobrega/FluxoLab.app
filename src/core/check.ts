import _ from "lodash";
import { Node } from "reactflow";

import { getUnreachableNodeIds } from "~/core/graph";
import { getExpectedText } from "~/core/language/errors";
import grammar from "~/core/language/grammar";
import semantics from "~/core/language/semantics";
import { Role, getRoleHandles } from "~/core/roles";
import { Flowchart, NodeData } from "~/store/useStoreFlowchart";
import { MachineError } from "~/store/useStoreMachine";

export default function (flowchart: Flowchart): MachineError[] {
  const errors: MachineError[] = [];
  errors.push(...checkGraph(flowchart));
  for (const node of flowchart.nodes) {
    if (node.data.role === Role.End) continue;
    errors.push(...checkNode(flowchart, node));
  }
  return errors;
}

function checkGraph(flowchart: Flowchart): MachineError[] {
  const { nodes, edges } = flowchart;
  const errors: MachineError[] = [];

  const startNodes = _.filter(nodes, { data: { role: Role.Start } });
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
    const handles = getRoleHandles(node.data.role);
    for (const handle of handles) {
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

  // Every block must be reachable from the start block; in particular, only
  // the start block may lack incoming edges. (Skipped when there is no start
  // block, since that error is already reported above.)
  if (startNodes.length > 0) {
    const startIds = _.map(startNodes, "id");
    for (const nodeId of getUnreachableNodeIds(flowchart, startIds)) {
      errors.push({
        type: "check",
        message: "CheckError_Unreachable",
        nodeId,
      });
    }
  }

  return errors;
}

function checkNode(flowchart: Flowchart, node: Node<NodeData>): MachineError[] {
  const { variables } = flowchart;
  const errors: MachineError[] = [];

  const prefix = node.data.role;

  const matchResult = grammar.match(
    `${prefix} ${node.data.payload}`,
    "Command",
  );
  if (matchResult.failed()) {
    errors.push({
      type: "syntax",
      message: "SyntaxError",
      nodeId: node.id,
      payload: {
        pos: matchResult.getInterval().startIdx - prefix.length - 1,
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
