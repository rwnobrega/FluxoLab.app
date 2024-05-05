import _ from "lodash";
import * as ohm from "ohm-js";

import assert from "~/utils/assert";

import {
  Value,
  binaryOperators,
  constants,
  functions,
  unaryOperators,
} from "./library";

export function evalUnaryOperator(a: ohm.Node, b: ohm.Node): Value {
  const id = a.sourceString;
  const arg = b.eval(this.args.state);
  const unaryOperator = _.find(unaryOperators, { id });
  assert(unaryOperator !== undefined);
  return unaryOperator.work(arg);
}

export function evalBinaryOperator(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
): Value {
  const left = a.eval(this.args.state);
  const id = b.sourceString;
  const right = c.eval(this.args.state);
  const binaryOperator = _.find(binaryOperators, { id });
  assert(binaryOperator !== undefined);
  return binaryOperator.work(left, right);
}

export function evalFunction(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
  d: ohm.Node,
): Value {
  const id = a.sourceString;
  const func = _.find(functions, { id });
  assert(func !== undefined);
  const args = _.map(c.asIteration().children, (child) =>
    child.eval(this.args.state),
  );
  if (_.includes(func.tags, "random")) {
    args.push(this.args.state.rand);
  }
  return func.work(...args);
}

export function evalVariable(a: ohm.Node): Value {
  const id = a.sourceString;
  const constant = _.find(constants, { id });
  if (constant !== undefined) {
    return constant.value;
  }
  const { value } = this.args.state.memory[id];
  if (value === null) {
    throw {
      message: "RuntimeError_VariableNotInitialized",
      payload: { id },
    };
  }
  return value;
}

export function evalParentheses(a: ohm.Node, b: ohm.Node, c: ohm.Node): Value {
  return b.eval(this.args.state);
}
