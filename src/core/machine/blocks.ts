import _ from "lodash";

import { getExpectedText } from "~/core/language/errors";
import evaluate from "~/core/language/evaluate";
import grammar from "~/core/language/grammar";

import { Machine, MachineState } from "./machine";
import { Variable, getVariableType } from "./variables";

export interface Block {
  id: string;
  type: "start" | "assignment" | "conditional" | "input" | "output" | "halt";
  work: (machine: Machine, state: MachineState) => void;
}

export function newStartBlock(params: { id: string; nextId: string }): Block {
  const { id, nextId } = params;
  return {
    id,
    type: "start",
    work: (_machine, state) => {
      state.curBlockId = nextId;
    },
  };
}

export function newAssignmentBlock(params: {
  id: string;
  variableId: string;
  expression: string;
  nextId: string;
}): Block {
  const { id, variableId, expression, nextId } = params;
  return {
    id,
    type: "assignment",
    work: (machine, state) => {
      const variable = _.find(machine.variables, {
        id: variableId,
      }) as Variable;
      const matchResult = grammar.match(expression, "Expression");
      if (matchResult.failed()) {
        state.error = { message: getExpectedText(matchResult) };
        state.status = "error";
        return;
      }
      const value = evaluate(matchResult, state.memory);
      if (value instanceof Error) {
        state.error = value;
        state.status = "error";
        return;
      }
      if (variable.type !== (typeof value as string)) {
        state.error = {
          message: "RuntimeError_AssignmentTypeMismatch",
          payload: { id: variableId, left: variable.type, right: typeof value },
        };
        state.status = "error";
        return;
      }
      state.memory[variableId] = value;
      state.curBlockId = nextId;
    },
  };
}

export function newConditionalBlock(params: {
  id: string;
  condition: string;
  nextTrue: string;
  nextFalse: string;
}): Block {
  const { id, condition, nextTrue, nextFalse } = params;
  return {
    id,
    type: "conditional",
    work: (_machine, state) => {
      const matchResult = grammar.match(condition, "Expression");
      if (matchResult.failed()) {
        state.error = { message: getExpectedText(matchResult) };
        state.status = "error";
        return;
      }
      const conditionValue = evaluate(matchResult, state.memory);
      if (conditionValue instanceof Error) {
        state.error = conditionValue;
        state.status = "error";
        return;
      }
      if (typeof conditionValue !== "boolean") {
        state.error = { message: "RuntimeError_ConditionNotBoolean" };
        state.status = "error";
        return;
      }
      state.curBlockId = conditionValue ? nextTrue : nextFalse;
    },
  };
}

export function newInputBlock(params: {
  id: string;
  variableId: string;
  nextId: string;
}): Block {
  const { id, variableId, nextId } = params;
  return {
    id,
    type: "input",
    work: (machine, state) => {
      if (state.input === null) {
        state.error = { message: "RuntimeError_NoInput" };
        state.status = "error";
        return;
      }
      const variable = _.find(machine.variables, {
        id: variableId,
      }) as Variable;
      const varType = getVariableType(variable.type);
      if (!varType.stringIsValid(state.input)) {
        state.error = {
          message: "RuntimeError_InvalidInput",
          payload: { input: state.input, type: variable.type },
        };
        state.status = "error";
        return;
      }
      state.memory[variableId] = varType.stringToValue(state.input);
      state.interaction.push({ direction: "in", text: state.input });
      state.input = null;
      state.status = "ready";
      state.curBlockId = nextId;
    },
  };
}

export function newOutputBlock(params: {
  id: string;
  expression: string;
  nextId: string;
}): Block {
  const { id, expression, nextId } = params;
  return {
    id,
    type: "output",
    work: (_machine, state) => {
      const matchResult = grammar.match(`write ${expression}`, "Command_write");
      if (matchResult.failed()) {
        state.error = { message: getExpectedText(matchResult) };
        state.status = "error";
        return;
      }
      const value = evaluate(matchResult, state.memory);
      if (value instanceof Error) {
        state.error = value;
        state.status = "error";
        return;
      }
      state.interaction.push({ direction: "out", text: String(value) });
      state.curBlockId = nextId;
    },
  };
}

export function newHaltBlock(params: { id: string }): Block {
  const { id } = params;
  return {
    id,
    type: "halt",
    work: (_machine, state) => {
      state.error = { message: "RuntimeError_MachineIsHalted" };
      state.status = "error";
    },
  };
}
