import _ from "lodash";

import { Node, Edge } from "reactflow";

import { Variable } from "./variables";

import {
  newStartSymbol,
  newAssignmentSymbol,
  newConditionalSymbol,
  newHaltSymbol,
  newInputSymbol,
  newOutputSymbol,
  Symbol,
} from "./symbols";

import grammar from "language/grammar";

function getOutgoingNode(
  nodeId: string,
  handleId: string,
  edges: Edge[],
): string | null {
  for (const edge of edges) {
    if (edge.source === nodeId && edge.sourceHandle === handleId) {
      return edge.target;
    }
  }
  return null;
}

export interface CompileError {
  message: string;
  nodeId: string | null;
  payload?: Record<string, string>;
}

interface CompilerInput {
  nodes: Node[];
  edges: Edge[];
  variables: Variable[];
}

interface CompilerOutput {
  flowchart: Symbol[];
  startSymbolId: string;
  errors: CompileError[];
}

export default function compile({
  nodes,
  edges,
  variables,
}: CompilerInput): CompilerOutput {
  function getStartSymbolId(): [string, CompileError[]] {
    const startNodes = _.filter(nodes, { type: "start" });
    if (startNodes.length === 0) {
      return ["", [{ message: "CompileError_NoStart", nodeId: null }]];
    } else if (startNodes.length > 1) {
      return ["", [{ message: "CompileError_MultipleStart", nodeId: null }]];
    }
    return [startNodes[0].id, []];
  }

  function compileFlowchart(): [Symbol[], CompileError[]] {
    const flowchart: Symbol[] = [];
    const errors: CompileError[] = [];
    for (const { id, type, data } of nodes) {
      switch (type) {
        case "start": {
          const nextId = getOutgoingNode(id, "out", edges);
          if (nextId === null) {
            errors.push({ message: "CompileError_NoOutgoing", nodeId: id });
          } else {
            flowchart.push(newStartSymbol({ id, nextId }));
          }
          break;
        }
        case "assignment": {
          const assignment: string = data;
          const matchResult = grammar.match(assignment, "Command_assignment");
          let variableId = "";
          let expression = "";
          if (assignment === "") {
            errors.push({
              message: "CompileError_EmptyAssignment",
              nodeId: id,
            });
          } else if (matchResult.failed()) {
            errors.push({ message: "CompileError_SyntaxError", nodeId: id });
          } else {
            // TODO: Use `matchResult` to get `variableId` and `expression`.
            const equalIndex = assignment.indexOf("=");
            variableId = _.trim(assignment.slice(0, equalIndex));
            expression = _.trim(assignment.slice(equalIndex + 1));
            // /TODO
            if (!_.some(variables, { id: variableId })) {
              errors.push({
                message: "CompileError_VariableNotFound",
                nodeId: id,
                payload: { id: variableId },
              });
            }
          }
          const nextId = getOutgoingNode(id, "out", edges);
          if (nextId === null) {
            errors.push({ message: "CompileError_NoOutgoing", nodeId: id });
          } else {
            flowchart.push(
              newAssignmentSymbol({ id, variableId, expression, nextId }),
            );
          }
          break;
        }
        case "conditional": {
          const condition: string = data;
          const matchResult = grammar.match(condition, "Expression");
          if (condition === "") {
            errors.push({
              message: "CompileError_EmptyConditional",
              nodeId: id,
            });
          } else if (matchResult.failed()) {
            errors.push({ message: "CompileError_SyntaxError", nodeId: id });
          }
          const nextTrue = getOutgoingNode(id, "true", edges);
          if (nextTrue === null) {
            errors.push({
              message: "CompileError_NoOutgoingOnOutput",
              nodeId: id,
              payload: { output: "T" },
            });
          }
          const nextFalse = getOutgoingNode(id, "false", edges);
          if (nextFalse === null) {
            errors.push({
              message: "CompileError_NoOutgoingOnOutput",
              nodeId: id,
              payload: { output: "F" },
            });
          }
          if (nextTrue !== null && nextFalse !== null) {
            flowchart.push(
              newConditionalSymbol({ id, condition, nextTrue, nextFalse }),
            );
          }
          break;
        }
        case "read": {
          const variableId: string = data;
          const matchResult = grammar.match(
            `read ${variableId}`,
            "Command_read",
          );
          if (variableId === "") {
            errors.push({ message: "CompileError_EmptyRead", nodeId: id });
          } else if (matchResult.failed()) {
            errors.push({ message: "CompileError_SyntaxError", nodeId: id });
          } else if (!_.some(variables, { id: variableId })) {
            errors.push({
              message: "CompileError_VariableNotFound",
              nodeId: id,
              payload: { id: variableId },
            });
          }
          const nextId = getOutgoingNode(id, "out", edges);
          if (nextId === null) {
            errors.push({ message: "CompileError_NoOutgoing", nodeId: id });
          } else {
            flowchart.push(newInputSymbol({ id, variableId, nextId }));
          }
          break;
        }
        case "write": {
          const expression: string = data;
          const matchResult = grammar.match(
            `write ${expression}`,
            "Command_write",
          );
          if (expression === "") {
            errors.push({ message: "CompileError_EmptyWrite", nodeId: id });
          } else if (matchResult.failed()) {
            errors.push({ message: "CompileError_SyntaxError", nodeId: id });
          }
          const nextId = getOutgoingNode(id, "out", edges);
          if (nextId === null) {
            errors.push({ message: "CompileError_NoOutgoing", nodeId: id });
          } else {
            flowchart.push(newOutputSymbol({ id, expression, nextId }));
          }
          break;
        }
        case "end": {
          flowchart.push(newHaltSymbol({ id }));
          break;
        }
      }
    }
    return [flowchart, errors];
  }

  const errors: CompileError[] = [];

  const [startSymbolId, errs1] = getStartSymbolId();
  errors.push(...errs1);

  const [flowchart, errs2] = compileFlowchart();
  errors.push(...errs2);

  return { flowchart, startSymbolId, errors };
}
