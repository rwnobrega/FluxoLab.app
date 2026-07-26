// Lehmer random number generator with Park-Miller parameters

const modulus = 2147483647; // 2**31 - 1
const a = 16807; // Primitive root modulo 2**31 - 1

const getNext = (x: number): number => {
  return (a * x) % modulus;
};

const rand = (x: number): number => {
  return x / modulus;
};

// The bounds are integers (and so is the result), but the generator itself
// works on floats, so the offset is drawn as a float and converted back.
const randInt = (a: bigint, b: bigint, x: number): bigint => {
  return a + BigInt(Math.floor(Number(b - a + 1n) * rand(x)));
};

export default {
  rand,
  randInt,
  getNext,
};
