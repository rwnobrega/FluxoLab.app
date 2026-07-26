import _ from "lodash";
import * as ohm from "ohm-js";

import { Value, getDataType, widen } from "~/core/dataTypes";
import assert from "~/utils/assert";
import minstd from "~/utils/minstd";

import {
  constants,
  findBinaryOperator,
  findFunction,
  findUnaryOperator,
} from "./library";

/* Which signature to run is decided from the types of the values at hand, and
 * the operands are then widened to the ones that signature expects.  The check
 * phase has already proved that a signature exists (and picked the same one,
 * since both use the resolution rules in `library.ts`), hence the assertions.
 *
 * Dispatching on the value types is not an optimization: `bigint` and `number`
 * do not mix in JavaScript, so running an integer signature on real operands
 * would throw a raw `TypeError` from inside `work`. */

export function evalUnaryOperator(a: ohm.Node, b: ohm.Node): Value {
  const id = a.sourceString;
  const arg = b.eval(this.args.state);
  const unaryOperator = findUnaryOperator(id, getDataType(arg));
  assert(unaryOperator !== undefined);
  return unaryOperator.work(widen(arg, unaryOperator.operandType));
}

export function evalBinaryOperator(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
): Value {
  const left = a.eval(this.args.state);
  const id = b.sourceString;
  const right = c.eval(this.args.state);
  const binaryOperator = findBinaryOperator(
    id,
    getDataType(left),
    getDataType(right),
  );
  assert(binaryOperator !== undefined);
  return binaryOperator.work(
    widen(left, binaryOperator.leftType),
    widen(right, binaryOperator.rightType),
  );
}

export function evalFunction(
  a: ohm.Node,
  _b: ohm.Node,
  c: ohm.Node,
  _d: ohm.Node,
): Value {
  const id = a.sourceString;
  const args = _.map(c.asIteration().children, (child) =>
    child.eval(this.args.state),
  );
  const func = findFunction(id, _.map(args, getDataType));
  assert(func !== undefined);
  const widenedArgs = _.map(args, (arg, index) =>
    widen(arg, func.parameterTypes[index]),
  );
  if (_.includes(func.tags, "random")) {
    this.args.state.rand = minstd.getNext(this.args.state.rand);
    widenedArgs.push(this.args.state.rand);
  }
  return func.work(...widenedArgs);
}

export function evalIdentifier(a: ohm.Node): Value {
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

export function evalParentheses(
  _a: ohm.Node,
  b: ohm.Node,
  _c: ohm.Node,
): Value {
  return b.eval(this.args.state);
}
