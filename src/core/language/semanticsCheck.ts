import _ from "lodash";
import * as ohm from "ohm-js";

import { MachineError } from "~/store/useStoreMachine";

import {
  binaryOperators,
  constants,
  functions,
  unaryOperators,
} from "./library";

export interface CheckError {
  message: MachineError["message"];
  payload?: MachineError["payload"];
}

export function checkVariable(a: ohm.Node): CheckError[] {
  const id = a.sourceString;
  if (_.find(functions, { id }) !== undefined) {
    return [{ message: "CheckError_IdentifierIsFunction", payload: { id } }];
  }
  const constantsAndVariables = [...constants, ...this.args.variables];
  if (_.find(constantsAndVariables, { id }) === undefined) {
    return [{ message: "CheckError_VariableNotFound", payload: { id } }];
  }
  return [];
}

export function checkParentheses(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
): CheckError[] {
  return b.check(this.args.variables);
}

export function checkExpressionBinary(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
): CheckError[] {
  const aCheck = a.check(this.args.variables);
  const cCheck = c.check(this.args.variables);
  if (aCheck.length > 0 || cCheck.length > 0) return [...aCheck, ...cCheck];
  const leftType = a.getType(this.args.variables);
  const id = b.sourceString;
  const rightType = c.getType(this.args.variables);
  const operator = _.find(binaryOperators, { id, leftType, rightType });
  if (operator === undefined) {
    return [
      {
        message: "CheckError_BinaryOperatorTypeMismatch",
        payload: { id, leftType, rightType },
      },
    ];
  }
  return [];
}

export function checkExpressionUnary(a: ohm.Node, b: ohm.Node): CheckError[] {
  const bCheck = b.check(this.args.variables);
  if (bCheck.length > 0) return bCheck;
  const id = a.sourceString;
  const operandType = b.getType(this.args.variables);
  const operator = _.find(unaryOperators, { id, operandType });
  if (operator === undefined) {
    return [
      {
        message: "CheckError_UnaryOperatorTypeMismatch",
        payload: { id, operandType },
      },
    ];
  }
  return [];
}

export function checkFunctionCall(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
  d: ohm.Node,
): CheckError[] {
  const errors: CheckError[] = [];
  for (const child of c.asIteration().children) {
    errors.push(...child.check(this.args.variables));
  }
  if (errors.length > 0) return errors;
  const id = a.sourceString;
  const function_ = _.find(functions, { id });
  if (function_ === undefined) {
    return [{ message: "CheckError_FunctionDoesNotExist", payload: { id } }];
  }
  const { parameterTypes } = function_;
  const arity = parameterTypes.length;
  const count = c.asIteration().children.length;
  if (arity !== count) {
    return [
      {
        message: `CheckError_FunctionArityMismatch_${arity <= 2 ? arity : "n"}`,
        payload: { id, arity, count },
      },
    ];
  }
  const argumentTypes = _.map(c.asIteration().children, (child) =>
    child.getType(this.args.variables),
  );
  if (!_.isEqual(argumentTypes, parameterTypes)) {
    return [
      {
        message: "CheckError_FunctionArgumentTypeMismatch",
        payload: {
          id,
          count: arity,
          parameterTypes: parameterTypes,
        },
      },
    ];
  }
  return [];
}

export function checkStart(a: ohm.Node): MachineError[] {
  return [];
}

export function checkRead(a: ohm.Node, b: ohm.Node): CheckError[] {
  return b.check(this.args.variables);
}

export function checkWrite(a: ohm.Node, b: ohm.Node): CheckError[] {
  const errors: CheckError[] = [];
  for (const child of b.asIteration().children) {
    errors.push(...child.check(this.args.variables));
  }
  return errors;
}

export function checkAssignment(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
): CheckError[] {
  const errors: CheckError[] = [];
  const id = a.sourceString;
  if (_.find(constants, { id }) !== undefined) {
    errors.push({
      message: "CheckError_AssignmentToConstant",
      payload: { id },
    });
  }
  const aCheck = a.check(this.args.variables);
  const cCheck = c.check(this.args.variables);
  if (aCheck.length > 0 || cCheck.length > 0) return [...aCheck, ...cCheck];
  const leftType = a.getType(this.args.variables);
  const rightType = c.getType(this.args.variables);
  if (leftType !== rightType) {
    errors.push({
      message: "CheckError_AssignmentTypeMismatch",
      payload: { id, leftType, rightType },
    });
  }
  return errors;
}

export function checkConditional(a: ohm.Node, b: ohm.Node): CheckError[] {
  const bCheck = b.check(this.args.variables);
  if (bCheck.length > 0) return bCheck;
  const conditionType = b.getType(this.args.variables);
  if (conditionType !== "boolean") {
    return [
      {
        message: "CheckError_ConditionNotBoolean",
        payload: { conditionType },
      },
    ];
  }
  return [];
}
