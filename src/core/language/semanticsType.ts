import _ from "lodash";
import * as ohm from "ohm-js";

import { VariableTypeId } from "~/core/variableTypes";

import {
  binaryOperators,
  constants,
  functions,
  unaryOperators,
} from "./library";

export function getTypeVariable(a: ohm.Node): VariableTypeId | "invalid" {
  const constantsAndVariables = [...constants, ...this.args.variables];
  const variable = _.find(constantsAndVariables, { id: a.sourceString });
  return variable === undefined ? "invalid" : variable.type;
}

export function getTypeParentheses(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
): VariableTypeId | "invalid" {
  return b.getType(this.args.variables);
}

export function getTypeExpressionBinary(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
): VariableTypeId | "invalid" {
  const leftType = a.getType(this.args.variables);
  const id = b.sourceString;
  const rightType = c.getType(this.args.variables);
  const operationObject = _.find(binaryOperators, { id, leftType, rightType });
  return operationObject === undefined ? "invalid" : operationObject.resultType;
}

export function getTypeUnaryOperator(
  a: ohm.Node,
  b: ohm.Node,
): VariableTypeId | "invalid" {
  const id = a.sourceString;
  const operandType = b.getType(this.args.variables);
  const operationObject = _.find(unaryOperators, { id, operandType });
  return operationObject === undefined ? "invalid" : operationObject.resultType;
}

export function getTypeFunctionCall(
  a: ohm.Node,
  b: ohm.Node,
  c: ohm.Node,
  d: ohm.Node,
): VariableTypeId | "invalid" {
  const id = a.sourceString;
  const parameterTypes = _.map(c.asIteration().children, (child) =>
    child.getType(this.args.variables),
  );
  const functionObject = _.find(functions, { id, parameterTypes });
  return functionObject === undefined ? "invalid" : functionObject.returnType;
}