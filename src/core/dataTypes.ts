export enum DataType {
  Integer = "integer",
  Real = "real",
  Boolean = "boolean",
  String = "string",
}

/* Runtime representation of each data type:
 *
 *     integer  ->  bigint   (arbitrary precision, like Python's int)
 *     real     ->  number   (IEEE 754 binary64)
 *     boolean  ->  boolean
 *     string   ->  string
 */
export type Value = bigint | number | boolean | string;

export function getDataType(value: Value): DataType {
  switch (typeof value) {
    case "bigint":
      return DataType.Integer;
    case "number":
      return DataType.Real;
    case "boolean":
      return DataType.Boolean;
    default:
      return DataType.String;
  }
}

/* ------------------------- Implicit conversion --------------------------- */

/**
 * Whether an expression of type `from` may be used where `to` is expected.
 *
 * The only implicit conversion is integer -> real: it never fails and never
 * surprises, whereas real -> integer would silently discard information (and
 * the student has `round`, `floor` and `ceil` to ask for it explicitly).
 */
export function isAssignable(
  from: DataType | null,
  to: DataType | null,
): boolean {
  if (from === null || to === null) return false;
  return from === to || (from === DataType.Integer && to === DataType.Real);
}

// Applies the conversion above to an actual value. Anything else is returned
// untouched, so this is safe to call on every operand.
export function widen(value: Value, type: DataType): Value {
  const needsWidening = type === DataType.Real && typeof value === "bigint";
  return needsWidening ? Number(value) : value;
}

/* ---------------------------- Size limit --------------------------------- */

/**
 * Integers are unbounded, so a single block (`fat = fat * fat` inside a loop,
 * or a careless `pow(2, 1000000000)`) could allocate gigabytes and freeze the
 * tab before the student notices anything. Results larger than this are
 * rejected with a runtime error -- never truncated, which would be the silent
 * overflow that arbitrary precision exists to avoid.
 */
export const MAX_INTEGER_DIGITS = 10000;

// Sizes are measured in base 16, which is linear in the number of digits;
// converting a huge integer to base 10 is not, and this runs after every
// integer operation. A hexadecimal digit is worth log10(16) ~ 1.2 decimal
// digits.
const MAX_INTEGER_HEX_DIGITS = Math.ceil(MAX_INTEGER_DIGITS / Math.log10(16));

function hexDigitCount(value: bigint): number {
  return (value < 0n ? -value : value).toString(16).length;
}

function assertIntegerFits(hexDigits: number): void {
  if (hexDigits > MAX_INTEGER_HEX_DIGITS) {
    throw {
      message: "RuntimeError_IntegerTooLarge",
      payload: { limit: MAX_INTEGER_DIGITS },
    };
  }
}

export function checkIntegerSize(value: bigint): bigint {
  assertIntegerFits(hexDigitCount(value));
  return value;
}

// `pow` is checked *before* computing, since computing first is exactly the
// freeze the limit exists to prevent. The size of the result is known in
// advance: raising to the n-th power multiplies the number of digits by n.
export function checkIntegerPowSize(base: bigint, exponent: bigint): void {
  if (base >= -1n && base <= 1n) return; // 0, 1 and -1 never grow.
  const magnitude = Number(base < 0n ? -base : base);
  // A base beyond float64 is already wide enough that its digit count is a
  // good enough estimate.
  const hexDigitsPerFactor = Number.isFinite(magnitude)
    ? Math.log2(magnitude) / 4
    : hexDigitCount(base);
  assertIntegerFits(hexDigitsPerFactor * Number(exponent));
}

/* ------------------------------ Parsing ---------------------------------- */

interface DataParser {
  stringIsValid: (str: string) => boolean;
  read: (str: string) => Value;
  write: (value: any) => string;
}

// A real is always written with a decimal point, so that the output tells `3`
// (integer) apart from `3.0` (real) -- which is the whole point of having two
// numeric types.
function withDecimalPoint(str: string): string {
  if (!str.includes(".")) return `${str}.0`;
  const trimmed = str.replace(/0+$/, "");
  return trimmed.endsWith(".") ? `${trimmed}0` : trimmed;
}

const DATA_PARSERS: Record<DataType, DataParser> = {
  integer: {
    stringIsValid(str: string): boolean {
      const integerRegex = /^-?\d+$/;
      return integerRegex.test(str);
    },
    read: (str: string): bigint => {
      return BigInt(str);
    },
    write: (value: bigint): string => {
      return value.toString();
    },
  },
  real: {
    stringIsValid(str: string): boolean {
      const realRegex = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/;
      return realRegex.test(str);
    },
    read: (str: string): number => {
      return parseFloat(str);
    },
    write: (value: number): string => {
      if (!Number.isFinite(value)) return value.toString();
      const p: string = value.toPrecision(6);
      if (p.includes("e")) {
        const [mantissa, signal, exponent] = p.split(/e([+-])/);
        return (
          withDecimalPoint(mantissa) + "e" + signal + exponent.padStart(2, "0")
        );
      }
      return withDecimalPoint(p);
    },
  },
  boolean: {
    stringIsValid(str: string): boolean {
      return str === "true" || str === "false";
    },
    read: (str: string): boolean => {
      return str === "true";
    },
    write: (value: boolean): string => {
      return value ? "true" : "false";
    },
  },
  string: {
    stringIsValid(_str: string): boolean {
      return true;
    },
    read: (str: string): string => {
      return str;
    },
    write: (value: string): string => {
      return value;
    },
  },
};

export function getDataParser(dataType: DataType): DataParser {
  return DATA_PARSERS[dataType];
}

/* ----------------------------- Displaying -------------------------------- */

// An integer wider than this is abbreviated: the variables panel is a narrow
// column, and `1000!` has 2568 digits.
const MAX_DISPLAY_DIGITS = 24;

/**
 * How a value is shown in the variables panel and in the desk-check table.
 *
 * This is deliberately not the parser's `write`, which feeds the output
 * stream: here strings are quoted (so that an empty string is distinguishable
 * from an uninitialized variable) and huge integers are abbreviated. A `null`
 * value means "not initialized yet".
 */
export function displayValue(
  value: Value | null,
  getString: (key: string, replacements?: Record<string, any>) => string,
): string {
  if (value === null) return "?";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "bigint") {
    const sign = value < 0n ? "-" : "";
    const digits = (value < 0n ? -value : value).toString();
    if (digits.length <= MAX_DISPLAY_DIGITS) return `${sign}${digits}`;
    const count = getString("Value_Digits", { count: digits.length });
    return `${sign}${digits.slice(0, 8)}…${digits.slice(-8)} (${count})`;
  }
  return getDataParser(getDataType(value)).write(value);
}
