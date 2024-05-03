import _ from "lodash";
import { Node } from "reactflow";

import { BlockTypeId, getBlockType } from "~/core/blockTypes";
import grammar from "~/core/language/grammar";
import { Flowchart } from "~/store/useStoreFlowchart";
import { MachineError } from "~/store/useStoreMachine";

export default function (flowchart: Flowchart): MachineError[] {
  const errors: MachineError[] = [];
  errors.push(...checkGraph(flowchart));
  for (const node of flowchart.nodes) {
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
          message: "CheckError_NoOutgoing",
          nodeId: node.id,
          payload: {
            output: handle.label ?? "?",
            count: handle.label === undefined ? "1" : "0",
          },
        });
      }
    }
  }

  return errors;
}

function checkNode(flowchart: Flowchart, node: Node): MachineError[] {
  const { variables } = flowchart;
  const errors: MachineError[] = [];
  switch (node.type) {
    case "read": {
      const variableId = node.data;
      const matchResult = grammar.match(`read ${variableId}`, "Command_read");
      if (variableId === "") {
        errors.push({
          type: "check",
          message: "CheckError_EmptyRead",
          nodeId: node.id,
        });
      } else if (matchResult.failed()) {
        errors.push({
          type: "check",
          message: "CheckError_SyntaxError",
          nodeId: node.id,
        });
      } else if (!_.some(variables, { id: variableId })) {
        errors.push({
          type: "check",
          message: "CheckError_VariableNotFound",
          nodeId: node.id,
          payload: { id: variableId },
        });
      }
      break;
    }
    case "write": {
      const expression = node.data;
      const matchResult = grammar.match(`write ${expression}`, "Command_write");
      if (expression === "") {
        errors.push({
          type: "check",
          message: "CheckError_EmptyWrite",
          nodeId: node.id,
        });
      } else if (matchResult.failed()) {
        errors.push({
          type: "check",
          message: "CheckError_SyntaxError",
          nodeId: node.id,
        });
      }
      break;
    }
    case "assignment": {
      const assignment = node.data;
      const matchResult = grammar.match(assignment, "Command_assignment");
      if (assignment === "") {
        errors.push({
          type: "check",
          message: "CheckError_EmptyAssignment",
          nodeId: node.id,
        });
      } else if (matchResult.failed()) {
        errors.push({
          type: "check",
          message: "CheckError_SyntaxError",
          nodeId: node.id,
        });
      } else {
        // TODO: Use `matchResult` to get `variableId` and `expression`.
        const equalIndex = assignment.indexOf("=");
        const variableId = _.trim(assignment.slice(0, equalIndex));
        // /TODO
        if (!_.some(variables, { id: variableId })) {
          errors.push({
            type: "check",
            message: "CheckError_VariableNotFound",
            nodeId: node.id,
            payload: { id: variableId },
          });
        }
      }
      break;
    }
    case "conditional": {
      const condition = node.data;
      const matchResult = grammar.match(condition, "Expression");
      if (condition === "") {
        errors.push({
          type: "check",
          message: "CheckError_EmptyConditional",
          nodeId: node.id,
        });
      } else if (matchResult.failed()) {
        errors.push({
          type: "check",
          message: "CheckError_SyntaxError",
          nodeId: node.id,
        });
      }
      break;
    }
  }
  return errors;
}
