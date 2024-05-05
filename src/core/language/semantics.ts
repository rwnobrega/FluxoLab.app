import { VariableTypeId } from "~/core/variableTypes";

import grammar from "./grammar";
import { Value } from "./library";
import {
  CheckError,
  checkAssignment,
  checkConditional,
  checkExpressionBinary,
  checkExpressionUnary,
  checkFunctionCall,
  checkParentheses,
  checkRead,
  checkStart,
  checkVariable,
  checkWrite,
} from "./semanticsCheck";
import {
  evalBinaryOperator,
  evalFunction,
  evalParentheses,
  evalUnaryOperator,
  evalVariable,
} from "./semanticsEval";
import {
  execAssignment,
  execConditional,
  execRead,
  execStart,
  execWrite,
} from "./semanticsExec";
import {
  getTypeExpressionBinary,
  getTypeFunctionCall,
  getTypeParentheses,
  getTypeUnaryOperator,
  getTypeVariable,
} from "./semanticsType";

const semantics = grammar.createSemantics();

semantics.addOperation<VariableTypeId | "invalid">("getType(variables)", {
  Primary_stringLiteral: (a) => "string",
  Primary_numberLiteral: (a) => "number",
  Primary_booleanLiteral: (a) => "boolean",
  Variable: getTypeVariable,
  Constant: getTypeVariable,
  Parentheses: getTypeParentheses,
  Expression_binary: getTypeExpressionBinary,
  Expression0_binary: getTypeExpressionBinary,
  Expression1_binary: getTypeExpressionBinary,
  Expression2_binary: getTypeExpressionBinary,
  Expression3_binary: getTypeExpressionBinary,
  Expression4_unary: getTypeUnaryOperator,
  FunctionCall: getTypeFunctionCall,
});

semantics.addOperation<CheckError[]>("check(variables)", {
  Primary_stringLiteral: (a) => [],
  Primary_numberLiteral: (a) => [],
  Primary_booleanLiteral: (a) => [],
  Variable: checkVariable,
  Constant: checkVariable,
  Parentheses: checkParentheses,
  Expression_binary: checkExpressionBinary,
  Expression0_binary: checkExpressionBinary,
  Expression1_binary: checkExpressionBinary,
  Expression2_binary: checkExpressionBinary,
  Expression3_binary: checkExpressionBinary,
  Expression4_unary: checkExpressionUnary,
  FunctionCall: checkFunctionCall,
  Command_start: checkStart,
  Command_read: checkRead,
  Command_write: checkWrite,
  Command_assignment: checkAssignment,
  Command_conditional: checkConditional,
});

semantics.addOperation<Value>("eval(state)", {
  Primary_stringLiteral: (a) => a.sourceString.slice(1, -1),
  Primary_numberLiteral: (a) => parseFloat(a.sourceString),
  Primary_booleanLiteral: (a) => a.sourceString === "true",
  Variable: evalVariable,
  Constant: evalVariable,
  Parentheses: evalParentheses,
  Expression_binary: evalBinaryOperator,
  Expression0_binary: evalBinaryOperator,
  Expression1_binary: evalBinaryOperator,
  Expression2_binary: evalBinaryOperator,
  Expression3_binary: evalBinaryOperator,
  Expression4_unary: evalUnaryOperator,
  FunctionCall: evalFunction,
});

semantics.addOperation<void>("exec(state)", {
  Command_start: execStart,
  Command_read: execRead,
  Command_write: execWrite,
  Command_assignment: execAssignment,
  Command_conditional: execConditional,
});

export default semantics;
