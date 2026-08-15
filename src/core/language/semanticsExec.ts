import _ from "lodash";
import * as ohm from "ohm-js";

import { getDataParser, getDataType, widen } from "~/core/dataTypes";
import { MachineState } from "~/store/useStoreMachine";
import assert from "~/utils/assert";

export function execStart(_a: ohm.Node): void {
  const state: MachineState = this.args.state;
  state.outPort = "out";
}

export function execRead(_a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  const children = b.asIteration().children;
  // A read takes exactly one token per variable off the head of the queue and
  // leaves the rest for the reads that follow. The machine only leaves the
  // `waiting` status once the queue is long enough, so a short queue here is a
  // failure of that gate, not of the program being run.
  assert(state.inputBuffer.length >= children.length);
  const inputTokens = state.inputBuffer.slice(0, children.length);
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
    state.memory[variableId].value = parser.read(input);
  }
  // What is recorded is what the block read, not what was typed: a line typed
  // ahead of time may answer several reads, and each of them shows its own
  // share.
  state.interaction.push({ direction: "in", text: inputTokens.join(" ") });
  state.inputBuffer = state.inputBuffer.slice(children.length);
  state.outPort = "out";
}

export function execWrite(_a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  let output = "";
  for (const expression of b.asIteration().children) {
    const value = expression.eval(state);
    const parser = getDataParser(getDataType(value));
    output += parser.write(value);
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
  // The check phase accepts an integer expression assigned to a real variable;
  // the value has to follow, or the variable would hold something of a type
  // other than the one it declares.
  const { type } = state.memory[variableId];
  state.memory[variableId].value = widen(expression, type);
  state.outPort = "out";
}

export function execConditional(_a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  const condition = b.eval(state);
  state.outPort = condition ? "true" : "false";
}
