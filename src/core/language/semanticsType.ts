import _ from "lodash";
import * as ohm from "ohm-js";

import { DataType } from "~/core/dataTypes";

import {
  binaryOperators,
  constants,
  functions,
  unaryOperators,
} from "./library";

export function getTypeIdentifier(a: ohm.Node): DataType | null {
  const constantsAndVariables = [...constants, ...this.args.variables];
  const variable = _.find(constantsAndVariables, { id: a.sourceString });
  return variable !== undefined ? variable.type : null;
}

export function getTypeParentheses(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
): DataType | null {
  return b.getType(this.args.variables);
}

export function getTypeExpressionBinary(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
): DataType | null {
  const leftType = a.getType(this.args.variables);
  const id = b.sourceString;
  const rightType = c.getType(this.args.variables);
  const operationObject = _.find(binaryOperators, { id, leftType, rightType });
  return operationObject !== undefined ? operationObject.resultType : null;
}

export function getTypeUnaryOperator(
  a: ohm.Node,
  b: ohm.Node,
): DataType | null {
  const id = a.sourceString;
  const operandType = b.getType(this.args.variables);
  const operationObject = _.find(unaryOperators, { id, operandType });
  return operationObject !== undefined ? operationObject.resultType : null;
}

export function getTypeFunctionCall(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
  d: ohm.Node,
): DataType | null {
  const id = a.sourceString;
  const parameterTypes = _.map(c.asIteration().children, (child) =>
    child.getType(this.args.variables),
  );
  const functionObject = _.find(functions, { id, parameterTypes });
  return functionObject !== undefined ? functionObject.returnType : null;
}
