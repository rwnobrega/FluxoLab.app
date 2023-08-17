import evaluate, { registerFunctions } from 'ts-expression-evaluator'

registerFunctions({
  div: (a: any, b: any) => Math.round(a / b),
  mod: (a: any, b: any) => a % b,
  pow: (a: any, b: any) => Math.pow(a, b),
  sqrt: (a: any) => Math.sqrt(a),
  log: (a: any) => Math.log(a),
  log10: (a: any) => Math.log10(a),
  log2: (a: any) => Math.log2(a),
  exp: (a: any) => Math.exp(a),
  sin: (a: any) => Math.sin(a),
  cos: (a: any) => Math.cos(a),
  tan: (a: any) => Math.tan(a),
  asin: (a: any) => Math.asin(a),
  acos: (a: any) => Math.acos(a),
  atan: (a: any) => Math.atan(a),
  sinh: (a: any) => Math.sinh(a),
  cosh: (a: any) => Math.cosh(a),
  tanh: (a: any) => Math.tanh(a),
  asinh: (a: any) => Math.asinh(a),
  acosh: (a: any) => Math.acosh(a),
  atanh: (a: any) => Math.atanh(a),
  sign: (a: any) => Math.sign(a),
  abs: (a: any) => Math.abs(a),
  round: (a: any) => Math.round(a),
  floor: (a: any) => Math.floor(a),
  ceil: (a: any) => Math.ceil(a),
  min: (a: any, b: any) => Math.min(a, b),
  max: (a: any, b: any) => Math.max(a, b)
})

export default evaluate
