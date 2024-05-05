import { VariableTypeId } from "~/core/variableTypes";
import minstd from "~/utils/minstd";

export type Value = number | boolean | string;

interface UnaryOperator {
  id: string;
  operandType: VariableTypeId;
  resultType: VariableTypeId;
  work: (a: Value) => Value;
}

interface BinaryOperator {
  id: string;
  leftType: VariableTypeId;
  rightType: VariableTypeId;
  resultType: VariableTypeId;
  work: (a: Value, b: Value) => Value;
}

interface Function {
  id: string;
  parameterTypes: VariableTypeId[];
  returnType: VariableTypeId;
  work: (...args: Value[]) => Value;
  tags?: string[];
}

interface Constant {
  id: string;
  type: VariableTypeId;
  value: Value;
}

const unaryOperators: UnaryOperator[] = [
  {
    id: "+",
    operandType: "number",
    resultType: "number",
    work: (a) => a,
  },
  {
    id: "-",
    operandType: "number",
    resultType: "number",
    work: (a) => -a,
  },
  {
    id: "!",
    operandType: "boolean",
    resultType: "boolean",
    work: (a) => !a,
  },
];

const binaryOperators: BinaryOperator[] = [
  {
    id: "||",
    leftType: "boolean",
    rightType: "boolean",
    resultType: "boolean",
    work: (a, b) => a || b,
  },
  {
    id: "&&",
    leftType: "boolean",
    rightType: "boolean",
    resultType: "boolean",
    work: (a, b) => a && b,
  },
  {
    id: "<=",
    leftType: "number",
    rightType: "number",
    resultType: "boolean",
    work: (a, b) => a <= b,
  },
  {
    id: "<",
    leftType: "number",
    rightType: "number",
    resultType: "boolean",
    work: (a, b) => a < b,
  },
  {
    id: ">=",
    leftType: "number",
    rightType: "number",
    resultType: "boolean",
    work: (a, b) => a >= b,
  },
  {
    id: ">",
    leftType: "number",
    rightType: "number",
    resultType: "boolean",
    work: (a, b) => a > b,
  },
  {
    id: "==",
    leftType: "number",
    rightType: "number",
    resultType: "boolean",
    work: (a, b) => a === b,
  },
  {
    id: "==",
    leftType: "boolean",
    rightType: "boolean",
    resultType: "boolean",
    work: (a, b) => a === b,
  },
  {
    id: "==",
    leftType: "string",
    rightType: "string",
    resultType: "boolean",
    work: (a, b) => a === b,
  },
  {
    id: "!=",
    leftType: "number",
    rightType: "number",
    resultType: "boolean",
    work: (a, b) => a !== b,
  },
  {
    id: "!=",
    leftType: "boolean",
    rightType: "boolean",
    resultType: "boolean",
    work: (a, b) => a !== b,
  },
  {
    id: "!=",
    leftType: "string",
    rightType: "string",
    resultType: "boolean",
    work: (a, b) => a !== b,
  },
  {
    id: "+",
    leftType: "number",
    rightType: "number",
    resultType: "number",
    work: (a: number, b: number) => a + b,
  },
  {
    id: "-",
    leftType: "number",
    rightType: "number",
    resultType: "number",
    work: (a: number, b: number) => a - b,
  },
  {
    id: "*",
    leftType: "number",
    rightType: "number",
    resultType: "number",
    work: (a: number, b: number) => a * b,
  },
  {
    id: "/",
    leftType: "number",
    rightType: "number",
    resultType: "number",
    work: (a: number, b: number) => a / b,
  },
  {
    id: "div",
    leftType: "number",
    rightType: "number",
    resultType: "number",
    work: (a: number, b: number) => Math.floor(a / b),
  },
  {
    id: "mod",
    leftType: "number",
    rightType: "number",
    resultType: "number",
    work: (a: number, b: number) => a % b,
  },
];

const functions: Function[] = [
  {
    id: "pow",
    parameterTypes: ["number", "number"],
    returnType: "number",
    work: Math.pow,
  },
  {
    id: "sqrt",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.sqrt,
  },
  {
    id: "log",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.log,
  },
  {
    id: "log10",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.log10,
  },
  {
    id: "log2",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.log2,
  },
  {
    id: "exp",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.exp,
  },
  {
    id: "sin",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.sin,
  },
  {
    id: "cos",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.cos,
  },
  {
    id: "tan",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.tan,
  },
  {
    id: "asin",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.asin,
  },
  {
    id: "acos",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.acos,
  },
  {
    id: "atan",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.atan,
  },
  {
    id: "sinh",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.sinh,
  },
  {
    id: "cosh",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.cosh,
  },
  {
    id: "tanh",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.tanh,
  },
  {
    id: "asinh",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.asinh,
  },
  {
    id: "acosh",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.acosh,
  },
  {
    id: "atanh",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.atanh,
  },
  {
    id: "sign",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.sign,
  },
  {
    id: "abs",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.abs,
  },
  {
    id: "round",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.round,
  },
  {
    id: "floor",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.floor,
  },
  {
    id: "ceil",
    parameterTypes: ["number"],
    returnType: "number",
    work: Math.ceil,
  },
  {
    id: "min",
    parameterTypes: ["number", "number"],
    returnType: "number",
    work: Math.min,
  },
  {
    id: "max",
    parameterTypes: ["number", "number"],
    returnType: "number",
    work: Math.max,
  },
  {
    id: "rand",
    parameterTypes: [],
    returnType: "number",
    work: minstd.rand,
    tags: ["random"],
  },
  {
    id: "rand_int",
    parameterTypes: ["number", "number"],
    returnType: "number",
    work: minstd.randInt,
    tags: ["random"],
  },
];

const constants: Constant[] = [
  {
    id: "pi",
    type: "number",
    value: Math.PI,
  },
  {
    id: "tau",
    type: "number",
    value: 2 * Math.PI,
  },
];

export { unaryOperators, binaryOperators, functions, constants };
