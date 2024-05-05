import _ from "lodash";
import * as ohm from "ohm-js";

import { VariableTypeId, getVariableType } from "~/core/variableTypes";
import { MachineState } from "~/store/useStoreMachine";
import assert from "~/utils/assert";

export function execStart(a: ohm.Node): void {
  const state: MachineState = this.args.state;
  state.outPort = "out";
}

export function execRead(a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  assert(state.input !== null);
  const variableId = b.sourceString;
  const { type } = state.memory[variableId];
  const variableType = getVariableType(type);
  if (!variableType.stringIsValid(state.input)) {
    throw {
      message: "RuntimeError_InvalidInput",
      payload: { input: state.input, type },
    };
  }
  state.interaction.push({ direction: "in", text: state.input });
  state.memory[variableId].value = variableType.parse(state.input);
  state.input = null;
  state.outPort = "out";
}

export function execWrite(a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  let output = "";
  for (const expression of b.asIteration().children) {
    const value = expression.eval(state);
    const variableType = getVariableType(typeof value as VariableTypeId);
    output += variableType.stringify(value);
  }
  state.interaction.push({ direction: "out", text: output });
  state.outPort = "out";
}

export function execAssignment(a: ohm.Node, b: ohm.Node, c: ohm.Node): void {
  const state: MachineState = this.args.state;
  const variableId = a.sourceString;
  const expression = c.eval(state);
  state.memory[variableId].value = expression;
  state.outPort = "out";
}

export function execConditional(a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  const condition = b.eval(state);
  state.outPort = condition ? "true" : "false";
}
