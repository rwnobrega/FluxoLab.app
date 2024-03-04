import _ from 'lodash'

import * as ohm from 'ohm-js'

import grammarContents from './expression.ohm'

import { getVariableType } from 'machine/variables'

import { Memory, VarType } from 'machine/types'

const grammar = ohm.grammar(grammarContents)

const unaryOperators: { [key: string]: (a: VarType) => VarType } = {
  '+': (a: number) => a,
  '-': (a: number) => -a,
  '!': (a: boolean) => !a
}

function evalUnaryOperator (a: ohm.Node, b: ohm.Node): VarType {
  const name = a.sourceString
  const arg = b.eval(this.args.memory)
  const argType = typeof arg
  const operandTypes = { '+': 'number', '-': 'number', '!': 'boolean' }
  for (const [operator, type] of _.toPairs(operandTypes)) {
    if (name === operator && argType !== type) {
      const part1 = `O operador \`${name}\` requer um operando do tipo \`${type}\``
      const part2 = `encontrado \`${argType as string}\``
      throw new Error(`${part1} (${part2}).`)
    }
  }
  return unaryOperators[name](arg)
}

const binaryOperators: { [key: string]: (a: VarType, b: VarType) => VarType } = {
  '||': (a: boolean, b: boolean) => a || b,
  '&&': (a: boolean, b: boolean) => a && b,
  '<=': (a: number, b: number) => a <= b,
  '<': (a: number, b: number) => a < b,
  '>=': (a: number, b: number) => a >= b,
  '>': (a: number, b: number) => a > b,
  '==': <T>(a: T, b: T) => a === b,
  '!=': <T>(a: T, b: T) => a !== b,
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
  div: (a: number, b: number) => Math.floor(a / b),
  mod: (a: number, b: number) => a % b
}

function evalBinaryOperator (a: ohm.Node, b: ohm.Node, c: ohm.Node): VarType {
  const left = a.eval(this.args.memory)
  const name = b.sourceString
  const right = c.eval(this.args.memory)
  if (_.includes(['||', '&&'], name)) {
    if (typeof left !== 'boolean' || typeof right !== 'boolean') {
      const part1 = `O operador \`${name}\` requer operandos do tipo \`boolean\``
      const part2 = `encontrados \`${typeof left as string}\` e \`${typeof right as string}\``
      throw new Error(`${part1} (${part2}).`)
    }
  }
  if (_.includes(['<=', '<', '>=', '>', '+', '-', '*', '/', 'div', 'mod'], name)) {
    if (typeof left !== 'number' || typeof right !== 'number') {
      const part1 = `O operador \`${name}\` requer operandos do tipo \`number\``
      const part2 = `encontrados \`${typeof left as string}\` e \`${typeof right as string}\``
      throw new Error(`${part1} (${part2}).`)
    }
  }
  if (_.includes(['==', '!='], name)) {
    if (typeof left !== typeof right) {
      const part1 = `O operador \`${name}\` requer operandos de tipos iguais`
      const part2 = `encontrados \`${typeof left as string}\` e \`${typeof right as string}\``
      throw new Error(`${part1} (${part2}).`)
    }
  }
  return binaryOperators[name](left, right)
}

const numericalFunctions: { [key: string]: (...args: number[]) => number } = {
  pow: (a: number, b: number) => Math.pow(a, b),
  sqrt: (a: number) => Math.sqrt(a),
  log: (a: number) => Math.log(a),
  log10: (a: number) => Math.log10(a),
  log2: (a: number) => Math.log2(a),
  exp: (a: number) => Math.exp(a),
  sin: (a: number) => Math.sin(a),
  cos: (a: number) => Math.cos(a),
  tan: (a: number) => Math.tan(a),
  asin: (a: number) => Math.asin(a),
  acos: (a: number) => Math.acos(a),
  atan: (a: number) => Math.atan(a),
  sinh: (a: number) => Math.sinh(a),
  cosh: (a: number) => Math.cosh(a),
  tanh: (a: number) => Math.tanh(a),
  asinh: (a: number) => Math.asinh(a),
  acosh: (a: number) => Math.acosh(a),
  atanh: (a: number) => Math.atanh(a),
  sign: (a: number) => Math.sign(a),
  abs: (a: number) => Math.abs(a),
  round: (a: number) => Math.round(a),
  floor: (a: number) => Math.floor(a),
  ceil: (a: number) => Math.ceil(a),
  min: (a: number, b: number) => Math.min(a, b),
  max: (a: number, b: number) => Math.max(a, b),
  rand_int: (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a
}

function evalNumericalFunction (a: ohm.Node, b: ohm.Node, c: ohm.Node, d: ohm.Node): number {
  const name = a.sourceString
  if (!_.has(numericalFunctions, name)) {
    throw new Error(`A função \`${name}\` não existe.`)
  }
  const args = _.map(c.asIteration().children, (child: ohm.Node) => child.eval(this.args.memory))
  if (_.includes(['pow', 'min', 'max', 'rand_int'], name)) {
    if (args.length !== 2) {
      const part1 = `A função \`${name}\` requer exatamente dois argumentos`
      const part2 = `fornecido${args.length === 1 ? '' : 's'} ${args.length}`
      throw new Error(`${part1} (${part2}).`)
    }
  } else if (args.length !== 1) {
    const part1 = `A função \`${name}\` requer exatamente um argumento`
    const part2 = `fornecidos ${args.length}`
    throw new Error(`${part1} (${part2}).`)
  }
  if (_.some(args, arg => typeof arg !== 'number')) {
    const argWord = args.length === 1 ? 'um argumento' : `${args.length} argumentos`
    const part1 = `A função \`${name}\` requer ${argWord} do tipo \`number\``
    const tickedArgTypes = _.map(args, arg => `\`${typeof arg as string}\``)
    const part2 = `encontrado${args.length === 1 ? '' : 's'} ${tickedArgTypes.join(', ')}`
    throw new Error(`${part1} (${part2}).`)
  }
  return numericalFunctions[name](...args)
}

function evalIdentifier (a: ohm.Node): VarType {
  const name = a.sourceString
  const value = this.args.memory[name]
  if (value === undefined) {
    throw new Error(`A variável \`${name}\` não existe.`)
  }
  if (value === null) {
    throw new Error(`A variável \`${name}\` não foi inicializada.`)
  }
  return value
}

function evalParentheses (a: ohm.Node, b: ohm.Node, c: ohm.Node): VarType {
  return b.eval(this.args.memory)
}

function evalPrint (a: ohm.Node, b: ohm.Node): string {
  const args = b.asIteration().children
  let result = ''
  for (const arg of args) {
    const value = arg.eval(this.args.memory)
    const varType = getVariableType(typeof value)
    result += varType.valueToString(value)
  }
  return result
}

const semantics: ohm.Semantics = grammar.createSemantics()

semantics.addOperation<VarType>('eval(memory)', {
  Primary_stringLiteral: a => a.sourceString.slice(1, -1),
  Primary_numberLiteral: a => parseFloat(a.sourceString),
  Primary_booleanLiteral: a => a.sourceString === 'true',
  Primary_identifier: evalIdentifier,
  Parentheses: evalParentheses,
  Print: evalPrint,
  Expression_binary: evalBinaryOperator,
  Disjunct_binary: evalBinaryOperator,
  Conjunct_binary: evalBinaryOperator,
  Side_binary: evalBinaryOperator,
  Term_binary: evalBinaryOperator,
  Factor_unary: evalUnaryOperator,
  FunctionCall: evalNumericalFunction
})

export default function evaluate (str: string, memory: Memory): VarType {
  const matchResult = grammar.match(str)
  if (matchResult.succeeded()) {
    return semantics(matchResult).eval(memory)
  }
  const matchMessage = matchResult.shortMessage?.replace(/Line 1, col \d+: /, '') as string
  const charIndex = matchResult.getInterval().endIdx
  throw new Error(`Erro de sintaxe: \`${str}\`\nPos ${charIndex}: ${matchMessage}.`)
}
