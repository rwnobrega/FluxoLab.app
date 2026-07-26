import _ from "lodash";

import {
  DataType,
  Value,
  checkIntegerPowSize,
  checkIntegerSize,
  isAssignable,
} from "~/core/dataTypes";
import minstd from "~/utils/minstd";

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

const { Integer, Real, Boolean, String } = DataType;

/* --------------------------- Integer helpers ----------------------------- */

/* `div` and `mod` follow the floor convention: the quotient is rounded towards
 * negative infinity and the remainder takes the sign of the divisor, which is
 * what they have always meant in FluxoLab (and what Python does).  BigInt's
 * own `/` truncates towards zero and `%` takes the sign of the dividend, so
 * both need fixing up when the operands have different signs. */

function integerDiv(a: bigint, b: bigint): bigint {
  if (b === 0n) throw { message: "RuntimeError_DivisionByZero" };
  const quotient = a / b;
  const isInexact = a % b !== 0n;
  return isInexact && a < 0n !== b < 0n ? quotient - 1n : quotient;
}

function integerMod(a: bigint, b: bigint): bigint {
  if (b === 0n) throw { message: "RuntimeError_DivisionByZero" };
  const remainder = a % b;
  const hasWrongSign = remainder !== 0n && remainder < 0n !== b < 0n;
  return hasWrongSign ? remainder + b : remainder;
}

function integerPow(a: bigint, b: bigint): bigint {
  if (b < 0n) {
    throw { message: "RuntimeError_NegativeExponent", payload: { id: "pow" } };
  }
  checkIntegerPowSize(a, b);
  return checkIntegerSize(a ** b);
}

// Rounding a real yields an integer, which is the explicit real -> integer
// bridge the language offers. Only a finite value has one.
function toInteger(round: (value: number) => number) {
  return (value: number): bigint => {
    if (!Number.isFinite(value)) throw { message: "RuntimeError_NotFinite" };
    return checkIntegerSize(BigInt(round(value)));
  };
}

/* ------------------------------ Operators -------------------------------- */

/* Signatures are listed from the most specific to the most general, i.e. the
 * integer one before the real one.  Resolution (see below) tries an exact
 * match first and only then allows integer arguments to widen to real, so this
 * order is what keeps `1 + 1` an integer addition. */

const unaryOperators: UnaryOperator[] = [
  {
    id: "+",
    operandType: Integer,
    resultType: Integer,
    work: (a) => a,
  },
  {
    id: "+",
    operandType: Real,
    resultType: Real,
    work: (a) => a,
  },
  {
    id: "-",
    operandType: Integer,
    resultType: Integer,
    work: (a: bigint) => -a,
  },
  {
    id: "-",
    operandType: Real,
    resultType: Real,
    work: (a: number) => -a,
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
    leftType: Integer,
    rightType: Integer,
    resultType: Boolean,
    work: (a, b) => a <= b,
  },
  {
    id: "<=",
    leftType: Real,
    rightType: Real,
    resultType: Boolean,
    work: (a, b) => a <= b,
  },
  {
    id: "<",
    leftType: Integer,
    rightType: Integer,
    resultType: Boolean,
    work: (a, b) => a < b,
  },
  {
    id: "<",
    leftType: Real,
    rightType: Real,
    resultType: Boolean,
    work: (a, b) => a < b,
  },
  {
    id: ">=",
    leftType: Integer,
    rightType: Integer,
    resultType: Boolean,
    work: (a, b) => a >= b,
  },
  {
    id: ">=",
    leftType: Real,
    rightType: Real,
    resultType: Boolean,
    work: (a, b) => a >= b,
  },
  {
    id: ">",
    leftType: Integer,
    rightType: Integer,
    resultType: Boolean,
    work: (a, b) => a > b,
  },
  {
    id: ">",
    leftType: Real,
    rightType: Real,
    resultType: Boolean,
    work: (a, b) => a > b,
  },
  {
    id: "==",
    leftType: Integer,
    rightType: Integer,
    resultType: Boolean,
    work: (a, b) => a === b,
  },
  {
    id: "==",
    leftType: Real,
    rightType: Real,
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
    leftType: Integer,
    rightType: Integer,
    resultType: Boolean,
    work: (a, b) => a !== b,
  },
  {
    id: "!=",
    leftType: Real,
    rightType: Real,
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
    leftType: Integer,
    rightType: Integer,
    resultType: Integer,
    work: (a: bigint, b: bigint) => checkIntegerSize(a + b),
  },
  {
    id: "+",
    leftType: Real,
    rightType: Real,
    resultType: Real,
    work: (a: number, b: number) => a + b,
  },
  {
    id: "-",
    leftType: Integer,
    rightType: Integer,
    resultType: Integer,
    work: (a: bigint, b: bigint) => checkIntegerSize(a - b),
  },
  {
    id: "-",
    leftType: Real,
    rightType: Real,
    resultType: Real,
    work: (a: number, b: number) => a - b,
  },
  {
    id: "*",
    leftType: Integer,
    rightType: Integer,
    resultType: Integer,
    work: (a: bigint, b: bigint) => checkIntegerSize(a * b),
  },
  {
    id: "*",
    leftType: Real,
    rightType: Real,
    resultType: Real,
    work: (a: number, b: number) => a * b,
  },
  // There is no integer `/` on purpose: dividing two integers widens them and
  // always yields a real, so `1 / 2` is `0.5` and never a silent `0`. Integer
  // division has its own named operator.
  {
    id: "/",
    leftType: Real,
    rightType: Real,
    resultType: Real,
    work: (a: number, b: number) => a / b,
  },
  {
    id: "div",
    leftType: Integer,
    rightType: Integer,
    resultType: Integer,
    work: integerDiv,
  },
  {
    id: "mod",
    leftType: Integer,
    rightType: Integer,
    resultType: Integer,
    work: integerMod,
  },
];

const functions: Function[] = [
  {
    id: "pow",
    parameterTypes: [Integer, Integer],
    returnType: Integer,
    work: integerPow,
  },
  {
    id: "pow",
    parameterTypes: [Real, Real],
    returnType: Real,
    work: Math.pow,
  },
  {
    id: "sqrt",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.sqrt,
  },
  {
    id: "log",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.log,
  },
  {
    id: "log10",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.log10,
  },
  {
    id: "log2",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.log2,
  },
  {
    id: "exp",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.exp,
  },
  {
    id: "sin",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.sin,
  },
  {
    id: "cos",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.cos,
  },
  {
    id: "tan",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.tan,
  },
  {
    id: "asin",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.asin,
  },
  {
    id: "acos",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.acos,
  },
  {
    id: "atan",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.atan,
  },
  {
    id: "sinh",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.sinh,
  },
  {
    id: "cosh",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.cosh,
  },
  {
    id: "tanh",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.tanh,
  },
  {
    id: "asinh",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.asinh,
  },
  {
    id: "acosh",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.acosh,
  },
  {
    id: "atanh",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.atanh,
  },
  {
    id: "sign",
    parameterTypes: [Integer],
    returnType: Integer,
    work: (a: bigint) => (a > 0n ? 1n : a < 0n ? -1n : 0n),
  },
  {
    id: "sign",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.sign,
  },
  {
    id: "abs",
    parameterTypes: [Integer],
    returnType: Integer,
    work: (a: bigint) => (a < 0n ? -a : a),
  },
  {
    id: "abs",
    parameterTypes: [Real],
    returnType: Real,
    work: Math.abs,
  },
  {
    id: "round",
    parameterTypes: [Real],
    returnType: Integer,
    work: toInteger(Math.round),
  },
  {
    id: "floor",
    parameterTypes: [Real],
    returnType: Integer,
    work: toInteger(Math.floor),
  },
  {
    id: "ceil",
    parameterTypes: [Real],
    returnType: Integer,
    work: toInteger(Math.ceil),
  },
  {
    id: "min",
    parameterTypes: [Integer, Integer],
    returnType: Integer,
    work: (a: bigint, b: bigint) => (a < b ? a : b),
  },
  {
    id: "min",
    parameterTypes: [Real, Real],
    returnType: Real,
    work: Math.min,
  },
  {
    id: "max",
    parameterTypes: [Integer, Integer],
    returnType: Integer,
    work: (a: bigint, b: bigint) => (a > b ? a : b),
  },
  {
    id: "max",
    parameterTypes: [Real, Real],
    returnType: Real,
    work: Math.max,
  },
  {
    id: "rand",
    parameterTypes: [],
    returnType: Real,
    work: minstd.rand,
    tags: ["random"],
  },
  {
    id: "rand_int",
    parameterTypes: [Integer, Integer],
    returnType: Integer,
    work: minstd.randInt,
    tags: ["random"],
  },
];

const constants: Constant[] = [
  {
    id: "pi",
    type: Real,
    value: Math.PI,
  },
  {
    id: "tau",
    type: Real,
    value: 2 * Math.PI,
  },
];

/* ------------------------------ Resolution ------------------------------- */

/* An operator or function may have more than one signature: `abs` accepts an
 * integer and a real, and gives back whatever it was given.  Resolution goes
 * in two passes -- an exact match wins, and only if there is none may integer
 * arguments widen to real.  Since the tables list integer signatures first,
 * the widened pass never has to choose between two candidates.
 *
 * The same functions are used by the type checker (on static types) and by the
 * interpreter (on the types of the values at hand), which is what keeps the
 * two in agreement. */

export function findUnaryOperator(
  id: string,
  operandType: DataType | null,
): UnaryOperator | undefined {
  const candidates = _.filter(unaryOperators, { id });
  return (
    _.find(candidates, (op) => op.operandType === operandType) ??
    _.find(candidates, (op) => isAssignable(operandType, op.operandType))
  );
}

export function findBinaryOperator(
  id: string,
  leftType: DataType | null,
  rightType: DataType | null,
): BinaryOperator | undefined {
  const candidates = _.filter(binaryOperators, { id });
  return (
    _.find(
      candidates,
      (op) => op.leftType === leftType && op.rightType === rightType,
    ) ??
    _.find(
      candidates,
      (op) =>
        isAssignable(leftType, op.leftType) &&
        isAssignable(rightType, op.rightType),
    )
  );
}

export function findFunction(
  id: string,
  argumentTypes: Array<DataType | null>,
): Function | undefined {
  const candidates = _.filter(
    functions,
    (func) =>
      func.id === id && func.parameterTypes.length === argumentTypes.length,
  );
  return (
    _.find(candidates, (func) =>
      _.isEqual(func.parameterTypes, argumentTypes),
    ) ??
    _.find(candidates, (func) =>
      _.every(func.parameterTypes, (type, index) =>
        isAssignable(argumentTypes[index], type),
      ),
    )
  );
}

// All the signatures of a given name, in declaration order. Every signature of
// a function has the same arity, so the first one answers "how many arguments
// does `min` take?" and the last one is the most general.
export function findFunctionOverloads(id: string): Function[] {
  return _.filter(functions, { id });
}

// The operator tables are private: everything else goes through the
// resolution functions above, so widening is applied in exactly one place.
export { functions, constants };
