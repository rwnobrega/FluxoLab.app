import _ from "lodash";
import * as ohm from "ohm-js";

import { isAssignable } from "~/core/dataTypes";
import { MachineError } from "~/store/useStoreMachine";

import {
  constants,
  findBinaryOperator,
  findFunction,
  findFunctionOverloads,
  findUnaryOperator,
  functions,
} from "./library";

export interface CheckError {
  message: MachineError["message"];
  payload?: MachineError["payload"];
}

export function checkIdentifier(a: ohm.Node): CheckError | null {
  const id = a.sourceString;
  if (_.find(functions, { id }) !== undefined) {
    return {
      message: "CheckError_VariableExpectedFoundFunction",
      payload: { id },
    };
  }
  const constantsAndVariables = [...constants, ...this.args.variables];
  if (_.find(constantsAndVariables, { id }) === undefined) {
    return {
      message: "CheckError_VariableNotFound",
      payload: { id },
    };
  }
  return null;
}

export function checkParentheses(
  _a: ohm.Node,
  b: ohm.Node,
  _c: ohm.Node,
): CheckError | null {
  return b.check(this.args.variables);
}

export function checkExpressionBinary(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
): CheckError | null {
  const aCheck = a.check(this.args.variables);
  if (aCheck !== null) return aCheck;
  const cCheck = c.check(this.args.variables);
  if (cCheck !== null) return cCheck;
  const leftType = a.getType(this.args.variables);
  const id = b.sourceString;
  const rightType = c.getType(this.args.variables);
  const operator = findBinaryOperator(id, leftType, rightType);
  if (operator === undefined) {
    return {
      message: "CheckError_BinaryOperatorTypeMismatch",
      payload: { id, leftType, rightType },
    };
  }
  return null;
}

export function checkExpressionUnary(
  a: ohm.Node,
  b: ohm.Node,
): CheckError | null {
  const bCheck = b.check(this.args.variables);
  if (bCheck !== null) return bCheck;
  const id = a.sourceString;
  const operandType = b.getType(this.args.variables);
  const operator = findUnaryOperator(id, operandType);
  if (operator === undefined) {
    return {
      message: "CheckError_UnaryOperatorTypeMismatch",
      payload: { id, operandType },
    };
  }
  return null;
}

export function checkFunctionCall(
  a: ohm.Node,
  _b: ohm.Node,
  c: ohm.Node,
  _d: ohm.Node,
): CheckError | null {
  for (const child of c.asIteration().children) {
    const error = child.check(this.args.variables);
    if (error !== null) return error;
  }
  const id = a.sourceString;
  const overloads = findFunctionOverloads(id);
  if (overloads.length === 0) {
    return {
      message: "CheckError_FunctionDoesNotExist",
      payload: { id },
    };
  }
  const arity = overloads[0].parameterTypes.length;
  const count = c.asIteration().children.length;
  if (arity !== count) {
    return {
      message: `CheckError_FunctionArityMismatch_${arity <= 2 ? arity : "n"}`,
      payload: { id, arity, count },
    };
  }
  const argumentTypes = _.map(c.asIteration().children, (child) =>
    child.getType(this.args.variables),
  );
  if (findFunction(id, argumentTypes) === undefined) {
    // Signatures are listed from the most specific to the most general, and
    // widening makes the last one accept everything the earlier ones do, so it
    // is the one worth showing the student.
    const { parameterTypes } = overloads[overloads.length - 1];
    return {
      message: "CheckError_FunctionArgumentTypeMismatch",
      payload: { id, count: arity, parameterTypes },
    };
  }
  return null;
}

export function checkVariableDeclaration(
  _a: ohm.Node,
  b: ohm.Node,
): CheckError | null {
  const id = b.sourceString;
  if (_.find(this.args.variables, { id }) !== undefined) {
    return { message: "IdentifierError_Duplicate" };
  }
  if (_.find(constants, { id }) !== undefined) {
    return { message: "IdentifierError_Constant" };
  }
  if (_.find(functions, { id }) !== undefined) {
    return { message: "IdentifierError_Function" };
  }
  return null;
}

export function checkStart(_a: ohm.Node): CheckError | null {
  return null;
}

export function checkRead(_a: ohm.Node, b: ohm.Node): CheckError | null {
  for (const child of b.asIteration().children) {
    const id = child.sourceString;
    if (_.find(constants, { id }) !== undefined) {
      return {
        message: "CheckError_VariableExpectedFoundConstant",
        payload: { id },
      };
    }
    if (_.find(functions, { id }) !== undefined) {
      return {
        message: "CheckError_VariableExpectedFoundFunction",
        payload: { id },
      };
    }
    const error = child.check(this.args.variables);
    if (error !== null) return error;
  }
  return null;
}

export function checkWrite(_a: ohm.Node, b: ohm.Node): CheckError | null {
  for (const child of b.asIteration().children) {
    const error = child.check(this.args.variables);
    if (error !== null) return error;
  }
  return null;
}

export function checkAssign(
  _a: ohm.Node,
  b: ohm.Node,
  _c: ohm.Node,
  d: ohm.Node,
): CheckError | null {
  const id = b.sourceString;
  if (_.find(constants, { id }) !== undefined) {
    return {
      message: "CheckError_VariableExpectedFoundConstant",
      payload: { id },
    };
  }
  if (_.find(functions, { id }) !== undefined) {
    return {
      message: "CheckError_VariableExpectedFoundFunction",
      payload: { id },
    };
  }
  const aCheck = b.check(this.args.variables);
  if (aCheck !== null) return aCheck;
  const cCheck = d.check(this.args.variables);
  if (cCheck !== null) return cCheck;
  const leftType = b.getType(this.args.variables);
  const rightType = d.getType(this.args.variables);
  if (!isAssignable(rightType, leftType)) {
    return {
      message: "CheckError_AssignmentTypeMismatch",
      payload: { id, leftType, rightType },
    };
  }
  return null;
}

export function checkConditional(_a: ohm.Node, b: ohm.Node): CheckError | null {
  const bCheck = b.check(this.args.variables);
  if (bCheck !== null) return bCheck;
  const conditionType = b.getType(this.args.variables);
  if (conditionType !== "boolean") {
    return {
      message: "CheckError_ConditionNotBoolean",
      payload: { conditionType },
    };
  }
  return null;
}
