import _ from "lodash";
import * as ohm from "ohm-js";

import { VariableTypeId, getVariableType } from "~/core/variableTypes";
import { MachineState } from "~/store/useStoreMachine";
import minstd from "~/utils/minstd";

import grammar from "./grammar";

type VarType = number | boolean | string;

const unaryOperators: Record<string, (a: VarType) => VarType> = {
  "+": (a: number) => a,
  "-": (a: number) => -a,
  "!": (a: boolean) => !a,
};

function evalUnaryOperator(a: ohm.Node, b: ohm.Node): VarType {
  const name = a.sourceString;
  const arg = b.eval(this.args.state);
  const argType = typeof arg;
  const operandTypes = { "+": "number", "-": "number", "!": "boolean" };
  for (const [operator, type] of _.toPairs(operandTypes)) {
    if (name === operator && argType !== type) {
      throw {
        message: "_CheckError_UnaryOperatorTypeMismatch",
        payload: { operator: name, expected: type, found: argType },
      };
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
  const left = a.eval(this.args.state);
  const name = b.sourceString;
  const right = c.eval(this.args.state);
  if (_.includes(["||", "&&"], name)) {
    if (typeof left !== "boolean" || typeof right !== "boolean") {
      throw {
        message: "_CheckError_BinaryOperatorTypeMismatch",
        payload: {
          operator: name,
          expected: "boolean",
          left: typeof left,
          right: typeof right,
        },
      };
    }
  }
  if (
    _.includes(["<=", "<", ">=", ">", "+", "-", "*", "/", "div", "mod"], name)
  ) {
    if (typeof left !== "number" || typeof right !== "number") {
      throw {
        message: "_CheckError_BinaryOperatorTypeMismatch",
        payload: {
          operator: name,
          expected: "number",
          left: typeof left,
          right: typeof right,
        },
      };
    }
  }
  if (_.includes(["==", "!="], name)) {
    if (typeof left !== typeof right) {
      throw {
        message: "_CheckError_BinaryOperatorTypeMismatchEqual",
        payload: { operator: name, left: typeof left, right: typeof right },
      };
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
  rand: (r: number) => minstd.rand(r),
  rand_int: (a: number, b: number, r: number) => minstd.randInt(a, b, r),
};

function evalNumericalFunction(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
  d: ohm.Node,
): number {
  const state: MachineState = this.args.state;
  const name = a.sourceString;
  if (!_.has(numericalFunctions, name)) {
    throw {
      message: "_CheckError_FunctionNotExists",
      payload: { id: name },
    };
  }
  const args = _.map(c.asIteration().children, (child: ohm.Node) =>
    child.eval(this.args.state),
  );
  if (_.includes(["pow", "min", "max", "rand_int"], name)) {
    if (args.length !== 2) {
      throw {
        message: "_CheckError_FunctionArityMismatch2",
        payload: { id: name, count: String(args.length) },
      };
    }
  } else if (_.includes(["rand"], name)) {
    if (args.length !== 0) {
      throw {
        message: "_CheckError_FunctionArityMismatch0",
        payload: { id: name, count: String(args.length) },
      };
    }
  } else if (args.length !== 1) {
    throw {
      message: "_CheckError_FunctionArityMismatch1",
      payload: { id: name, count: String(args.length) },
    };
  }
  if (_.some(args, (arg) => typeof arg !== "number")) {
    throw {
      message: "_CheckError_FunctionArgumentTypeMismatchNumber",
      payload: { id: name, count: String(args.length) },
    };
  }
  if (_.includes(["rand", "rand_int"], name)) {
    state.rand = minstd.getNext(state.rand);
    args.push(state.rand);
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
    throw {
      message: "_CheckError_ConstantNotExists",
      payload: { id: name },
    };
  }
  return numericalConstants[name];
}

function evalIdentifier(a: ohm.Node): VarType {
  const state: MachineState = this.args.state;
  const name = a.sourceString;
  if (!_.has(state.memory, name)) {
    throw {
      message: "_CheckError_VariableNotFound",
      payload: { id: name },
    };
  }
  const { value } = state.memory[name];
  if (value === null) {
    throw {
      message: "RuntimeError_VariableNotInitialized",
      payload: { id: name },
    };
  }
  return value;
}

function evalParentheses(a: ohm.Node, b: ohm.Node, c: ohm.Node): VarType {
  return b.eval(this.args.state);
}

// Command functions

function performStart(a: ohm.Node): void {
  const state: MachineState = this.args.state;
  state.outPort = "out";
}

function performRead(a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  const variableId = b.sourceString;
  const input = state.input ?? "";
  const { type } = state.memory[variableId];
  const variableType = getVariableType(type);
  if (!variableType.stringIsValid(input)) {
    throw {
      message: "RuntimeError_InvalidInput",
      payload: { input, type },
    };
  }
  state.interaction.push({ direction: "in", text: input });
  state.memory[variableId].value = variableType.parse(input);
  state.outPort = "out";
}

function performWrite(a: ohm.Node, b: ohm.Node): void {
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

function performAssignment(a: ohm.Node, b: ohm.Node, c: ohm.Node): void {
  const state: MachineState = this.args.state;
  const variableId = a.sourceString;
  const expression = c.eval(state);
  state.memory[variableId].value = expression;
  state.outPort = "out";
}

function performConditional(a: ohm.Node, b: ohm.Node): void {
  const state: MachineState = this.args.state;
  const condition = b.eval(state);
  if (typeof condition !== "boolean") {
    throw {
      message: "_CheckError_ConditionNotBoolean",
    };
  }
  state.outPort = condition ? "true" : "false";
}

const semantics = grammar.createSemantics();

semantics.addOperation<VarType | void>("eval(state)", {
  Primary_stringLiteral: (a) => a.sourceString.slice(1, -1),
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
  Command_start: performStart,
  Command_read: performRead,
  Command_write: performWrite,
  Command_assignment: performAssignment,
  Command_conditional: performConditional,
});

export default semantics;
