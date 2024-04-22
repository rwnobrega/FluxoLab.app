import _ from "lodash";
import * as ohm from "ohm-js";

import { MachineState } from "~/core/machine/machine";
import { VarType, getVariableType } from "~/core/machine/variables";

import grammar from "./grammar";

const unaryOperators: Record<string, (a: VarType) => VarType> = {
  "+": (a: number) => a,
  "-": (a: number) => -a,
  "!": (a: boolean) => !a,
};

function evalUnaryOperator(a: ohm.Node, b: ohm.Node): VarType {
  const name = a.sourceString;
  const arg = b.eval(this.args.memory);
  const argType = typeof arg;
  const operandTypes = { "+": "number", "-": "number", "!": "boolean" };
  for (const [operator, type] of _.toPairs(operandTypes)) {
    if (name === operator && argType !== type) {
      throw new EvaluateError({
        message: "RuntimeError_UnaryOperatorTypeMismatch",
        payload: { operator: name, expected: type, found: argType },
      });
    }
  }
  return unaryOperators[name](arg);
}

const binaryOperators: Record<string, (a: VarType, b: VarType) => VarType> = {
  "||": (a: boolean, b: boolean) => a || b,
  "&&": (a: boolean, b: boolean) => a && b,
  "<=": (a: number, b: number) => a <= b,
  "<": (a: number, b: number) => a < b,
  ">=": (a: number, b: number) => a >= b,
  ">": (a: number, b: number) => a > b,
  "==": <T>(a: T, b: T) => a === b,
  "!=": <T>(a: T, b: T) => a !== b,
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
  div: (a: number, b: number) => Math.floor(a / b),
  mod: (a: number, b: number) => a % b,
};

function evalBinaryOperator(a: ohm.Node, b: ohm.Node, c: ohm.Node): VarType {
  const left = a.eval(this.args.memory);
  const name = b.sourceString;
  const right = c.eval(this.args.memory);
  if (_.includes(["||", "&&"], name)) {
    if (typeof left !== "boolean" || typeof right !== "boolean") {
      throw new EvaluateError({
        message: "RuntimeError_BinaryOperatorTypeMismatch",
        payload: {
          operator: name,
          expected: "boolean",
          left: typeof left,
          right: typeof right,
        },
      });
    }
  }
  if (
    _.includes(["<=", "<", ">=", ">", "+", "-", "*", "/", "div", "mod"], name)
  ) {
    if (typeof left !== "number" || typeof right !== "number") {
      throw new EvaluateError({
        message: "RuntimeError_BinaryOperatorTypeMismatch",
        payload: {
          operator: name,
          expected: "number",
          left: typeof left,
          right: typeof right,
        },
      });
    }
  }
  if (_.includes(["==", "!="], name)) {
    if (typeof left !== typeof right) {
      throw new EvaluateError({
        message: "RuntimeError_BinaryOperatorTypeMismatchEqual",
        payload: { operator: name, left: typeof left, right: typeof right },
      });
    }
  }
  return binaryOperators[name](left, right);
}

const numericalFunctions: Record<string, (...args: number[]) => number> = {
  pow: (a: number, b: number) => Math.pow(a, b),
  sqrt: (a: number) => Math.sqrt(a),
  log: (a: number) => Math.log(a),
  log10: (a: number) => Math.log10(a),
  log2: (a: number) => Math.log2(a),
  exp: (a: number) => Math.exp(a),
  sin: (a: number) => Math.sin(a),
  cos: (a: number) => Math.cos(a),
  tan: (a: number) => Math.tan(a),
  asin: (a: number) => Math.asin(a),
  acos: (a: number) => Math.acos(a),
  atan: (a: number) => Math.atan(a),
  sinh: (a: number) => Math.sinh(a),
  cosh: (a: number) => Math.cosh(a),
  tanh: (a: number) => Math.tanh(a),
  asinh: (a: number) => Math.asinh(a),
  acosh: (a: number) => Math.acosh(a),
  atanh: (a: number) => Math.atanh(a),
  sign: (a: number) => Math.sign(a),
  abs: (a: number) => Math.abs(a),
  round: (a: number) => Math.round(a),
  floor: (a: number) => Math.floor(a),
  ceil: (a: number) => Math.ceil(a),
  min: (a: number, b: number) => Math.min(a, b),
  max: (a: number, b: number) => Math.max(a, b),
  rand: () => Math.random(),
  rand_int: (a: number, b: number) =>
    Math.floor(Math.random() * (b - a + 1)) + a,
};

function evalNumericalFunction(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
  d: ohm.Node,
): number {
  const name = a.sourceString;
  if (!_.has(numericalFunctions, name)) {
    throw new EvaluateError({
      message: "RuntimeError_FunctionNotExists",
      payload: { id: name },
    });
  }
  const args = _.map(c.asIteration().children, (child: ohm.Node) =>
    child.eval(this.args.memory),
  );
  if (_.includes(["pow", "min", "max", "rand_int"], name)) {
    if (args.length !== 2) {
      throw new EvaluateError({
        message: "RuntimeError_FunctionArityMismatch2",
        payload: { id: name, count: String(args.length) },
      });
    }
  } else if (_.includes(["rand"], name)) {
    if (args.length !== 0) {
      throw new EvaluateError({
        message: "RuntimeError_FunctionArityMismatch0",
        payload: { id: name, count: String(args.length) },
      });
    }
  } else if (args.length !== 1) {
    throw new EvaluateError({
      message: "RuntimeError_FunctionArityMismatch1",
      payload: { id: name, count: String(args.length) },
    });
  }
  if (_.some(args, (arg) => typeof arg !== "number")) {
    throw new EvaluateError({
      message: "RuntimeError_FunctionArgumentTypeMismatchNumber",
      payload: { id: name, count: String(args.length) },
    });
  }
  return numericalFunctions[name](...args);
}

const numericalConstants: Record<string, number> = {
  pi: Math.PI,
  tau: 2 * Math.PI,
};

function evalNumericalConstant(a: ohm.Node): number {
  const name = a.sourceString;
  if (!_.has(numericalConstants, name)) {
    throw new EvaluateError({
      message: "RuntimeError_ConstantNotExists",
      payload: { id: name },
    });
  }
  return numericalConstants[name];
}

function evalIdentifier(a: ohm.Node): VarType {
  const name = a.sourceString;
  const value = this.args.memory[name];
  if (value === undefined) {
    throw new EvaluateError({
      message: "RuntimeError_VariableNotFound",
      payload: { id: name },
    });
  }
  if (value === null) {
    throw new EvaluateError({
      message: "RuntimeError_VariableNotInitialized",
      payload: { id: name },
    });
  }
  return value;
}

function evalParentheses(a: ohm.Node, b: ohm.Node, c: ohm.Node): VarType {
  return b.eval(this.args.memory);
}

function getOutput(a: ohm.Node, b: ohm.Node): string {
  const args = b.asIteration().children;
  let result = "";
  for (const arg of args) {
    const value = arg.eval(this.args.memory);
    const varType = getVariableType(typeof value);
    result += varType.valueToString(value);
  }
  return result;
}

const semantics = grammar.createSemantics();

semantics.addOperation<VarType>("eval(memory)", {
  Primary_stringLiteral: (a) =>
    a.sourceString.slice(1, -1).replace(/\\"/g, '"'),
  Primary_numberLiteral: (a) => parseFloat(a.sourceString),
  Primary_booleanLiteral: (a) => a.sourceString === "true",
  Primary_identifier: evalIdentifier,
  Primary_constant: evalNumericalConstant,
  Parentheses: evalParentheses,
  Expression_binary: evalBinaryOperator,
  Expression0_binary: evalBinaryOperator,
  Expression1_binary: evalBinaryOperator,
  Expression2_binary: evalBinaryOperator,
  Expression3_binary: evalBinaryOperator,
  Expression4_unary: evalUnaryOperator,
  FunctionCall: evalNumericalFunction,
  Command_write: getOutput,
});

class EvaluateError extends Error {
  payload?: Record<string, string>;

  constructor({
    message,
    payload,
  }: {
    message: string;
    payload?: Record<string, string>;
  }) {
    super(message);
    this.payload = payload;
  }
}

export default function (
  matchResult: ohm.MatchResult,
  memory: MachineState["memory"],
): VarType | EvaluateError {
  try {
    return semantics(matchResult).eval(memory);
  } catch (evaluateError) {
    return evaluateError;
  }
}
