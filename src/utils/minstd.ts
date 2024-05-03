// Lehmer random number generator with Park-Miller parameters

const modulus = 2147483647; // 2**31 - 1
const a = 16807; // Primitive root modulo 2**31 - 1

const getNext = (x: number): number => {
  return (a * x) % modulus;
};

const rand = (x: number): number => {
  return x / modulus;
};

const randInt = (a: number, b: number, x: number): number => {
  return Math.floor((b - a + 1) * rand(x) + a);
};

export default {
  rand,
  randInt,
  getNext,
};
