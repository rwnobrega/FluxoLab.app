import _ from "lodash";
import * as ohm from "ohm-js";

import { DataType, getDataParser } from "~/core/dataTypes";
import splitIntoTokens from "~/core/splitIntoTokens";
import { MachineState } from "~/store/useStoreMachine";
import assert from "~/utils/assert";

export function execStart(_a: ohm.Node): void {
  const state: MachineState = this.args.state;
  state.outPort = "out";
}

export function execRead(_a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  assert(state.input !== null);
  const inputTokens = splitIntoTokens(state.input);
  const children = b.asIteration().children;
  if (children.length !== inputTokens.length) {
    throw {
      message: "RuntimeError_InvalidNumberOfTokens",
      payload: { count: inputTokens.length, expected: children.length },
    };
  }
  for (const [child, input] of _.zip(children, inputTokens)) {
    assert(child !== undefined && input !== undefined);
    const variableId = child.sourceString;
    const { type } = state.memory[variableId];
    const parser = getDataParser(type);
    if (!parser.stringIsValid(input)) {
      throw {
        message: "RuntimeError_InvalidInput",
        payload: { input, type },
      };
    }
    state.memory[variableId].value = parser.parse(input);
  }
  state.interaction.push({ direction: "in", text: state.input });
  state.input = null;
  state.outPort = "out";
}

export function execWrite(_a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  let output = "";
  for (const expression of b.asIteration().children) {
    const value = expression.eval(state);
    const dataType = typeof value as DataType;
    const parser = getDataParser(dataType);
    output += parser.stringify(value);
  }
  state.interaction.push({ direction: "out", text: output });
  state.outPort = "out";
}

export function execAssign(
  _a: ohm.Node,
  b: ohm.Node,
  _c: ohm.Node,
  d: ohm.Node,
): void {
  const state: MachineState = this.args.state;
  const variableId = b.sourceString;
  const expression = d.eval(state);
  state.memory[variableId].value = expression;
  state.outPort = "out";
}

export function execConditional(_a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  const condition = b.eval(state);
  state.outPort = condition ? "true" : "false";
}
