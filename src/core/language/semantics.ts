import { DataType } from "~/core/dataTypes";

import grammar from "./grammar";
import { Value } from "./library";
import {
  CheckError,
  checkAssign,
  checkConditional,
  checkExpressionBinary,
  checkExpressionUnary,
  checkFunctionCall,
  checkIdentifier,
  checkParentheses,
  checkRead,
  checkStart,
  checkVariableDeclaration,
  checkWrite,
} from "./semanticsCheck";
import {
  evalBinaryOperator,
  evalFunction,
  evalIdentifier,
  evalParentheses,
  evalUnaryOperator,
} from "./semanticsEval";
import {
  execAssign,
  execConditional,
  execRead,
  execStart,
  execWrite,
} from "./semanticsExec";
import {
  getTypeExpressionBinary,
  getTypeFunctionCall,
  getTypeIdentifier,
  getTypeParentheses,
  getTypeUnaryOperator,
} from "./semanticsType";

const semantics = grammar.createSemantics();

semantics.addOperation<DataType | null>("getType(variables)", {
  Primary_stringLiteral: (a) => DataType.String,
  Primary_numberLiteral: (a) => DataType.Number,
  Primary_booleanLiteral: (a) => DataType.Boolean,
  Identifier: getTypeIdentifier,
  Parentheses: getTypeParentheses,
  Expression_binary: getTypeExpressionBinary,
  Expression0_binary: getTypeExpressionBinary,
  Expression1_binary: getTypeExpressionBinary,
  Expression2_binary: getTypeExpressionBinary,
  Expression3_binary: getTypeExpressionBinary,
  Expression4_unary: getTypeUnaryOperator,
  FunctionCall: getTypeFunctionCall,
});

semantics.addOperation<CheckError | null>("check(variables)", {
  Primary_stringLiteral: (a) => null,
  Primary_numberLiteral: (a) => null,
  Primary_booleanLiteral: (a) => null,
  Identifier: checkIdentifier,
  Parentheses: checkParentheses,
  Expression_binary: checkExpressionBinary,
  Expression0_binary: checkExpressionBinary,
  Expression1_binary: checkExpressionBinary,
  Expression2_binary: checkExpressionBinary,
  Expression3_binary: checkExpressionBinary,
  Expression4_unary: checkExpressionUnary,
  FunctionCall: checkFunctionCall,
  Command_var: checkVariableDeclaration,
  Command_start: checkStart,
  Command_read: checkRead,
  Command_write: checkWrite,
  Command_assign: checkAssign,
  Command_conditional: checkConditional,
});

semantics.addOperation<Value>("eval(state)", {
  Primary_stringLiteral: (a) => a.sourceString.slice(1, -1),
  Primary_numberLiteral: (a) => parseFloat(a.sourceString),
  Primary_booleanLiteral: (a) => a.sourceString === "true",
  Identifier: evalIdentifier,
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
  Command_assign: execAssign,
  Command_conditional: execConditional,
});

export default semantics;
