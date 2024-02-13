import _ from 'lodash'

import { parse } from 'acorn'

import { Memory, VarType } from 'machine/types'

export default function evaluate (str: string, memory: Memory): VarType {
  const ast = parse(str, { ecmaVersion: 3 }) as any
  return evaluateNode(ast.body[0], memory)
}

const binaryOperators: {[key: string]: (a: VarType, b: VarType) => VarType} = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
  '>': (a: number, b: number) => a > b,
  '>=': (a: number, b: number) => a >= b,
  '<': (a: number, b: number) => a < b,
  '<=': (a: number, b: number) => a <= b,
  '==': (a: VarType, b: VarType) => a === b,
  '!=': (a: VarType, b: VarType) => a !== b
}

const logicalOperators: {[key: string]: (a: boolean, b: boolean) => boolean} = {
  '&&': (a: boolean, b: boolean) => a && b,
  '||': (a: boolean, b: boolean) => a || b
}

const unaryOperators: {[key: string]: (a: VarType) => VarType} = {
  '+': (a: number) => +a,
  '-': (a: number) => -a,
  '!': (a: boolean) => !a
}

const functions: {[key: string]: (args: number[]) => number} = {
  div: (args: number[]) => Math.floor(args[0] / args[1]),
  mod: (args: number[]) => args[0] % args[1],
  pow: (args: number[]) => Math.pow(args[0], args[1]),
  sqrt: (args: number[]) => Math.sqrt(args[0]),
  log: (args: number[]) => Math.log(args[0]),
  log10: (args: number[]) => Math.log10(args[0]),
  log2: (args: number[]) => Math.log2(args[0]),
  exp: (args: number[]) => Math.exp(args[0]),
  sin: (args: number[]) => Math.sin(args[0]),
  cos: (args: number[]) => Math.cos(args[0]),
  tan: (args: number[]) => Math.tan(args[0]),
  asin: (args: number[]) => Math.asin(args[0]),
  acos: (args: number[]) => Math.acos(args[0]),
  atan: (args: number[]) => Math.atan(args[0]),
  sinh: (args: number[]) => Math.sinh(args[0]),
  cosh: (args: number[]) => Math.cosh(args[0]),
  tanh: (args: number[]) => Math.tanh(args[0]),
  asinh: (args: number[]) => Math.asinh(args[0]),
  acosh: (args: number[]) => Math.acosh(args[0]),
  atanh: (args: number[]) => Math.atanh(args[0]),
  sign: (args: number[]) => Math.sign(args[0]),
  abs: (args: number[]) => Math.abs(args[0]),
  round: (args: number[]) => Math.round(args[0]),
  floor: (args: number[]) => Math.floor(args[0]),
  ceil: (args: number[]) => Math.ceil(args[0]),
  min: (args: number[]) => Math.min(...args),
  max: (args: number[]) => Math.max(...args)
}

function evaluateNode (node: any, memory: Memory): VarType {
  if (node.type === 'ExpressionStatement') {
    return evaluateNode(node.expression, memory)
  }

  if (node.type === 'Literal') {
    return node.value
  }

  if (node.type === 'Identifier') {
    const value = memory[node.name]
    if (value === undefined) {
      throw new Error(`A variável '${node.name as string}' não existe`)
    }
    if (value === null) {
      throw new Error(`A variável '${node.name as string}' não foi inicializada`)
    }
    return value
  }

  if (node.type === 'LogicalExpression') {
    const op = logicalOperators[node.operator]
    if (op === undefined) {
      throw new Error(`O operador '${node.operator as string}' não existe`)
    }
    const left = evaluateNode(node.left, memory)
    const right = evaluateNode(node.right, memory)
    const commonError = `O operador '${node.operator as string}' requer operandos booleanos`
    if (typeof left !== 'boolean') {
      throw new Error(`${commonError} ('${left as string}' é do tipo '${typeof left as string}')`)
    }
    if (typeof right !== 'boolean') {
      throw new Error(`${commonError} ('${right as string}' é do tipo '${typeof right as string}')`)
    }
    return op(left, right)
  }

  if (node.type === 'BinaryExpression') {
    const op = binaryOperators[node.operator]
    if (op === undefined) {
      throw new Error(`O operador '${node.operator as string}' não existe`)
    }
    const left = evaluateNode(node.left, memory)
    const right = evaluateNode(node.right, memory)
    const commonError = `O operador '${node.operator as string}' requer operandos numéricos`
    if (_.includes(['+', '-', '*', '/', '>', '>=', '<', '<='], node.operator)) {
      if (typeof left !== 'number') {
        throw new Error(`${commonError} ('${left as string}' é do tipo '${typeof left as string}')`)
      }
      if (typeof right !== 'number') {
        throw new Error(`${commonError} ('${right as string}' é do tipo '${typeof right as string}')`)
      }
    }
    return op(left, right)
  }

  if (node.type === 'UnaryExpression') {
    const op = unaryOperators[node.operator]
    if (op === undefined) {
      throw new Error(`O operador '${node.operator as string}' não existe`)
    }
    const arg = evaluateNode(node.argument, memory)
    const argType = typeof arg
    const operandTypes = {
      '+': 'number',
      '-': 'number',
      '!': 'boolean'
    }
    const commonError = `O operador '${node.operator as string}' requer um operando`
    for (const [operator, type] of Object.entries(operandTypes)) {
      if (node.operator === operator && argType !== type) {
        throw new Error(`${commonError} ${type} ('${arg as string}' é do tipo '${argType}')`)
      }
    }
    return op(arg)
  }

  if (node.type === 'CallExpression') {
    const func = functions[node.callee.name]
    if (func === undefined) {
      throw new Error(`A função '${node.callee.name as string}' não existe`)
    }
    const args = node.arguments.map((arg: any) => evaluateNode(arg, memory))
    return func(args)
  }

  if (node.type === 'SequenceExpression') {
    // String concatenation
    return node.expressions.map((expr: any) => evaluateNode(expr, memory)).join('')
  }

  throw new Error(`Erro de sintaxe: ${node.type as string}`)
}
