import { DataType } from "~/core/dataTypes";
import minstd from "~/utils/minstd";

export type Value = number | boolean | string;

interface UnaryOperator {
  id: string;
  operandType: DataType;
  resultType: DataType;
  work: (a: Value) => Value;
}

interface BinaryOperator {
  id: string;
  leftType: DataType;
  rightType: DataType;
  resultType: DataType;
  work: (a: Value, b: Value) => Value;
}

interface Function {
  id: string;
  parameterTypes: DataType[];
  returnType: DataType;
  work: (...args: Value[]) => Value;
  tags?: string[];
}

interface Constant {
  id: string;
  type: DataType;
  value: Value;
}

const { Number, Boolean, String } = DataType;

const unaryOperators: UnaryOperator[] = [
  {
    id: "+",
    operandType: Number,
    resultType: Number,
    work: (a) => a,
  },
  {
    id: "-",
    operandType: Number,
    resultType: Number,
    work: (a) => -a,
  },
  {
    id: "!",
    operandType: Boolean,
    resultType: Boolean,
    work: (a) => !a,
  },
];

const binaryOperators: BinaryOperator[] = [
  {
    id: "||",
    leftType: Boolean,
    rightType: Boolean,
    resultType: Boolean,
    work: (a, b) => a || b,
  },
  {
    id: "&&",
    leftType: Boolean,
    rightType: Boolean,
    resultType: Boolean,
    work: (a, b) => a && b,
  },
  {
    id: "<=",
    leftType: Number,
    rightType: Number,
    resultType: Boolean,
    work: (a, b) => a <= b,
  },
  {
    id: "<",
    leftType: Number,
    rightType: Number,
    resultType: Boolean,
    work: (a, b) => a < b,
  },
  {
    id: ">=",
    leftType: Number,
    rightType: Number,
    resultType: Boolean,
    work: (a, b) => a >= b,
  },
  {
    id: ">",
    leftType: Number,
    rightType: Number,
    resultType: Boolean,
    work: (a, b) => a > b,
  },
  {
    id: "==",
    leftType: Number,
    rightType: Number,
    resultType: Boolean,
    work: (a, b) => a === b,
  },
  {
    id: "==",
    leftType: Boolean,
    rightType: Boolean,
    resultType: Boolean,
    work: (a, b) => a === b,
  },
  {
    id: "==",
    leftType: String,
    rightType: String,
    resultType: Boolean,
    work: (a, b) => a === b,
  },
  {
    id: "!=",
    leftType: Number,
    rightType: Number,
    resultType: Boolean,
    work: (a, b) => a !== b,
  },
  {
    id: "!=",
    leftType: Boolean,
    rightType: Boolean,
    resultType: Boolean,
    work: (a, b) => a !== b,
  },
  {
    id: "!=",
    leftType: String,
    rightType: String,
    resultType: Boolean,
    work: (a, b) => a !== b,
  },
  {
    id: "+",
    leftType: Number,
    rightType: Number,
    resultType: Number,
    work: (a: number, b: number) => a + b,
  },
  {
    id: "-",
    leftType: Number,
    rightType: Number,
    resultType: Number,
    work: (a: number, b: number) => a - b,
  },
  {
    id: "*",
    leftType: Number,
    rightType: Number,
    resultType: Number,
    work: (a: number, b: number) => a * b,
  },
  {
    id: "/",
    leftType: Number,
    rightType: Number,
    resultType: Number,
    work: (a: number, b: number) => a / b,
  },
  {
    id: "div",
    leftType: Number,
    rightType: Number,
    resultType: Number,
    work: (a: number, b: number) => Math.floor(a / b),
  },
  {
    id: "mod",
    leftType: Number,
    rightType: Number,
    resultType: Number,
    work: (a: number, b: number) => a - Math.floor(a / b) * b,
  },
];

const functions: Function[] = [
  {
    id: "pow",
    parameterTypes: [Number, Number],
    returnType: Number,
    work: Math.pow,
  },
  {
    id: "sqrt",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.sqrt,
  },
  {
    id: "log",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.log,
  },
  {
    id: "log10",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.log10,
  },
  {
    id: "log2",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.log2,
  },
  {
    id: "exp",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.exp,
  },
  {
    id: "sin",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.sin,
  },
  {
    id: "cos",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.cos,
  },
  {
    id: "tan",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.tan,
  },
  {
    id: "asin",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.asin,
  },
  {
    id: "acos",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.acos,
  },
  {
    id: "atan",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.atan,
  },
  {
    id: "sinh",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.sinh,
  },
  {
    id: "cosh",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.cosh,
  },
  {
    id: "tanh",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.tanh,
  },
  {
    id: "asinh",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.asinh,
  },
  {
    id: "acosh",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.acosh,
  },
  {
    id: "atanh",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.atanh,
  },
  {
    id: "sign",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.sign,
  },
  {
    id: "abs",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.abs,
  },
  {
    id: "round",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.round,
  },
  {
    id: "floor",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.floor,
  },
  {
    id: "ceil",
    parameterTypes: [Number],
    returnType: Number,
    work: Math.ceil,
  },
  {
    id: "min",
    parameterTypes: [Number, Number],
    returnType: Number,
    work: Math.min,
  },
  {
    id: "max",
    parameterTypes: [Number, Number],
    returnType: Number,
    work: Math.max,
  },
  {
    id: "rand",
    parameterTypes: [],
    returnType: Number,
    work: minstd.rand,
    tags: ["random"],
  },
  {
    id: "rand_int",
    parameterTypes: [Number, Number],
    returnType: Number,
    work: minstd.randInt,
    tags: ["random"],
  },
];

const constants: Constant[] = [
  {
    id: "pi",
    type: Number,
    value: Math.PI,
  },
  {
    id: "tau",
    type: Number,
    value: 2 * Math.PI,
  },
];

export { unaryOperators, binaryOperators, functions, constants };
