/*  Test runner for the type system (integer / real)
 *
 *  Usage:  npx vite-node src/tests/language/run.ts
 *
 *  (vite-node, rather than tsx, is required because the grammar is loaded
 *  through a Vite `?raw` import.)
 *
 *  1. Literals and static types, including the integer -> real widening.
 *  2. Assignment compatibility.
 *  3. Evaluation: which signature runs, and what it produces.
 *  4. Arbitrary precision and the size limit.
 *  5. Runtime errors.
 *  6. How values are written and displayed.
 *  7. Reading values from the input.
 *  8. Serialization of variable types (shared links).
 *  9. Executing commands, where a widened value is actually stored.
 * 10. Running a whole flowchart end to end.
 * 11. Type names: one vocabulary for the panel and the pseudocode.
 */
import strings from "~/assets/strings.json";
import {
  DataType,
  Value,
  displayValue,
  getDataParser,
  getDataType,
} from "~/core/dataTypes";
import execute from "~/core/execute";
import grammar from "~/core/language/grammar";
import semantics from "~/core/language/semantics";
import { emitPseudocode } from "~/core/pseudocode";
import factorial from "~/examples/factorial";
import { SimpleFlowchart, deserialize, serialize } from "~/store/serialize";
import { Flowchart } from "~/store/useStoreFlowchart";

const { Integer, Real, Boolean, String } = DataType;

/* ------------------------------- Harness --------------------------------- */

type Variables = Array<{ id: string; type: DataType }>;

const VARIABLES: Variables = [
  { id: "n", type: Integer },
  { id: "m", type: Integer },
  { id: "x", type: Real },
  { id: "s", type: String },
  { id: "b", type: Boolean },
];

const VALUES: Record<string, Value> = {
  n: 7n,
  m: 2n,
  x: 2.5,
  s: "abc",
  b: true,
};

function matchExpression(source: string) {
  const matchResult = grammar.match(source, "Expression");
  if (matchResult.failed()) throw new Error(`syntax error: ${source}`);
  return matchResult;
}

// Static type of an expression, or null when it does not type-check.
function typeOf(source: string): DataType | null {
  return semantics(matchExpression(source)).getType(VARIABLES);
}

// The check-phase error of a whole command, or null when it is well-formed.
function commandError(source: string): string | null {
  const matchResult = grammar.match(source, "Command");
  if (matchResult.failed()) return "SyntaxError";
  const error = semantics(matchResult).check(VARIABLES);
  return error === null ? null : error.message;
}

function evaluate(source: string): Value {
  const memory: Record<string, { type: DataType; value: Value }> = {};
  for (const { id, type } of VARIABLES)
    memory[id] = { type, value: VALUES[id] };
  return semantics(matchExpression(source)).eval({ memory, rand: 1 });
}

// The runtime error message of an expression, or null if it evaluates fine.
function runtimeError(source: string): string | null {
  try {
    evaluate(source);
    return null;
  } catch (error) {
    return error instanceof Error
      ? `internal: ${error.message}`
      : error.message;
  }
}

// What `write` would put in the output stream.
function written(source: string): string {
  const value = evaluate(source);
  return getDataParser(getDataType(value)).write(value);
}

/* ----------------------------- Test helpers ------------------------------ */

let failures = 0;

function check(label: string, ok: boolean, details = ""): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : "\n" + details}`);
  if (!ok) failures += 1;
}

function checkType(source: string, expected: DataType | null): void {
  const actual = typeOf(source);
  check(
    `${source}  :  ${expected ?? "ill-typed"}`,
    actual === expected,
    `  got ${actual ?? "ill-typed"}`,
  );
}

function checkValue(source: string, expected: Value): void {
  const actual = evaluate(source);
  check(
    `${source}  =  ${expected}`,
    actual === expected,
    `  got ${actual} (${typeof actual})`,
  );
}

/* ---------------------- 1. Literals and static types --------------------- */

console.log("== Literals and static types ==");

checkType("3", Integer);
checkType("3.0", Real);
checkType("3e2", Real); // Written like a real, so it is one.
checkType("3.5e-2", Real);
checkType('"abc"', String);
checkType("true", Boolean);
checkType("n", Integer);
checkType("x", Real);
checkType("pi", Real);

console.log("\n== Widening: integer is accepted where a real is expected ==");

checkType("1 + 1", Integer);
checkType("1 + 1.0", Real);
checkType("1.0 + 1", Real);
checkType("-n", Integer);
checkType("-x", Real);
checkType("1 / 2", Real); // Never a silent zero.
checkType("x / x", Real);
checkType("n div m", Integer);
checkType("n mod m", Integer);
checkType("x div x", null); // Integer division is for integers only.
checkType("sqrt(2)", Real); // The argument widens.
checkType("abs(n)", Integer);
checkType("abs(x)", Real);
checkType("min(n, m)", Integer);
checkType("min(n, x)", Real);
checkType("pow(2, 3)", Integer);
checkType("pow(2.0, 3)", Real);
checkType("round(x)", Integer); // The explicit real -> integer bridge.
checkType("floor(x)", Integer);
checkType("ceil(x)", Integer);
checkType("rand()", Real);
checkType("rand_int(1, 6)", Integer);
checkType("n == m", Boolean);
checkType("n == x", Boolean); // Mixed comparison widens.
checkType("n < x", Boolean);
checkType("s == s", Boolean);
checkType("n == s", null);
checkType("n + s", null);
checkType("!n", null);
checkType("rand_int(1.5, 6.5)", null); // No real -> integer conversion.

/* ------------------------ 2. Assignment compatibility -------------------- */

console.log("\n== Assignment ==");

check(
  "assign x = 1 (integer into real)",
  commandError("assign x = 1") === null,
);
check(
  "assign x = 1 / 2 (real into real)",
  commandError("assign x = 1 / 2") === null,
);
check(
  "assign n = 1 (integer into integer)",
  commandError("assign n = 1") === null,
);
check(
  "assign n = 1.0 is rejected (no real -> integer)",
  commandError("assign n = 1.0") === "CheckError_AssignmentTypeMismatch",
  `  got ${commandError("assign n = 1.0")}`,
);
check(
  "assign n = x / 2 is rejected",
  commandError("assign n = x / 2") === "CheckError_AssignmentTypeMismatch",
);
check(
  "assign n = round(x / 2) is accepted",
  commandError("assign n = round(x / 2)") === null,
);
check(
  "assign n = s is rejected",
  commandError("assign n = s") === "CheckError_AssignmentTypeMismatch",
);

/* ----------------------------- 3. Evaluation ----------------------------- */

console.log("\n== Evaluation ==");

checkValue("1 + 1", 2n);
checkValue("1 + 1.0", 2);
checkValue("1 / 2", 0.5);
checkValue("n / m", 3.5);
checkValue("2 == 2.0", true);
checkValue("abs(-n)", 7n);
checkValue("abs(-x)", 2.5);
checkValue("sign(-n)", -1n);
checkValue("max(n, m)", 7n);
checkValue("max(n, x)", 7);
checkValue("round(2.5)", 3n);
checkValue("floor(-2.5)", -3n);
checkValue("ceil(-2.5)", -2n);
checkValue("pow(2, 10)", 1024n);
checkValue("pow(2.0, 0.5)", Math.SQRT2);
checkValue("sqrt(9)", 3);
checkValue("rand_int(1, 1)", 1n);

console.log("\n== div and mod round towards negative infinity ==");

// BigInt's own `/` truncates towards zero and `%` follows the dividend, so
// these are the cases that would silently change meaning if left alone.
checkValue("7 div 2", 3n);
checkValue("-7 div 2", -4n);
checkValue("7 div -2", -4n);
checkValue("-7 div -2", 3n);
checkValue("7 mod 2", 1n);
checkValue("-7 mod 2", 1n);
checkValue("7 mod -2", -1n);
checkValue("-7 mod -2", -1n);

/* --------------------- 4. Arbitrary precision and limits ------------------ */

console.log("\n== Arbitrary precision ==");

{
  // 23! is the first factorial that float64 cannot represent exactly.
  let factorial = 1n;
  for (let i = 1n; i <= 25n; i += 1n) factorial *= i;
  const value = evaluate(
    "1 * 2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 * 10 * 11 * 12 * 13 * 14 * 15 * " +
      "16 * 17 * 18 * 19 * 20 * 21 * 22 * 23 * 24 * 25",
  );
  check(
    "25! is exact",
    value === factorial,
    `  got ${value}, expected ${factorial}`,
  );
  check(
    "25! is beyond float64",
    factorial !== BigInt(Number(factorial)),
    "  the test itself is vacuous if this fails",
  );
}

check(
  "an oversized result is rejected",
  runtimeError("pow(10, 100000)") === "RuntimeError_IntegerTooLarge",
  `  got ${runtimeError("pow(10, 100000)")}`,
);
check(
  "an oversized power is rejected before being computed",
  runtimeError("pow(2, 1000000000)") === "RuntimeError_IntegerTooLarge",
  `  got ${runtimeError("pow(2, 1000000000)")}`,
);
check(
  "a power of 1 never grows",
  runtimeError("pow(1, 1000000000)") === null,
  `  got ${runtimeError("pow(1, 1000000000)")}`,
);
check("9999 digits are allowed", runtimeError("pow(10, 9998)") === null);

/* --------------------------- 5. Runtime errors --------------------------- */

console.log("\n== Runtime errors ==");

check(
  "integer division by zero",
  runtimeError("n div 0") === "RuntimeError_DivisionByZero",
  `  got ${runtimeError("n div 0")}`,
);
check(
  "integer remainder by zero",
  runtimeError("n mod 0") === "RuntimeError_DivisionByZero",
);
check(
  "negative integer exponent",
  runtimeError("pow(2, -1)") === "RuntimeError_NegativeExponent",
  `  got ${runtimeError("pow(2, -1)")}`,
);
check(
  "rounding an infinite value",
  runtimeError("round(1.0 / 0.0)") === "RuntimeError_NotFinite",
  `  got ${runtimeError("round(1.0 / 0.0)")}`,
);
check(
  "no raw JavaScript error escapes",
  runtimeError("pow(2, 1000000000)")?.startsWith("internal:") !== true,
);

/* ------------------------ 6. Writing and displaying ---------------------- */

console.log("\n== Output ==");

// A real always carries a decimal point, so the output tells the two numeric
// types apart.
const writes: Array<[string, string]> = [
  ["3", "3"],
  ["3.0", "3.0"],
  ["1 / 2", "0.5"],
  ["3.0 * 500", "1500.0"],
  ["1.0 / 3.0", "0.333333"],
  ["pow(10, 30)", "1000000000000000000000000000000"],
  ["1.0e30", "1.0e+30"],
  ["1.0e-7", "1.0e-07"],
  ['"abc"', "abc"],
  ["true", "true"],
];
for (const [source, expected] of writes) {
  check(
    `write ${source}  ->  ${expected}`,
    written(source) === expected,
    `  got ${written(source)}`,
  );
}

const getString = (key: string, replacements: Record<string, any> = {}) =>
  key === "Value_Digits" ? `${replacements.count} digits` : key;

check(
  "an uninitialized variable displays as ?",
  displayValue(null, getString) === "?",
);
check(
  "a string is quoted in the variables panel",
  displayValue("abc", getString) === '"abc"',
);
check(
  "a huge integer is abbreviated",
  displayValue(10n ** 100n, getString) === "10000000…00000000 (101 digits)",
  `  got ${displayValue(10n ** 100n, getString)}`,
);
check(
  "an integer of 24 digits is shown in full",
  displayValue(10n ** 23n, getString) === `1${"0".repeat(23)}`,
);

/* ----------------------------- 7. Reading -------------------------------- */

console.log("\n== Reading from the input ==");

const integerParser = getDataParser(Integer);
const realParser = getDataParser(Real);

check("integer accepts 42", integerParser.stringIsValid("42"));
check("integer accepts -42", integerParser.stringIsValid("-42"));
check("integer rejects 3.5", !integerParser.stringIsValid("3.5"));
check("integer rejects 1e3", !integerParser.stringIsValid("1e3"));
check("real accepts 42", realParser.stringIsValid("42"));
check("real accepts 3.5", realParser.stringIsValid("3.5"));
check("real accepts 1e3", realParser.stringIsValid("1e3"));
check(
  "a big integer is read exactly",
  integerParser.read("123456789012345678901234567890") ===
    123456789012345678901234567890n,
);

/* --------------------------- 8. Serialization ---------------------------- */

console.log("\n== Serialization ==");

{
  const flowchart = {
    title: "types",
    variables: [
      { id: "n", type: Integer },
      { id: "x", type: Real },
      { id: "b", type: Boolean },
      { id: "s", type: String },
    ],
    nodes: [],
    edges: [],
  } as unknown as Flowchart;
  const restored = deserialize(serialize(flowchart));
  check(
    "variable types survive a round trip",
    JSON.stringify(restored.variables) === JSON.stringify(flowchart.variables),
    `  got ${JSON.stringify(restored.variables)}`,
  );
}

{
  // A link created before the split stored the single numeric type as index 0.
  // It must still expand -- into `real`, which is what it used to behave like.
  const legacy = JSON.stringify(["legacy", [["v", 0]], [], []]);
  const { variables } = deserialize(
    (await import("lz-string")).compressToEncodedURIComponent(legacy),
  );
  check(
    "a legacy `number` variable becomes a real",
    variables.length === 1 && variables[0].type === Real,
    `  got ${JSON.stringify(variables)}`,
  );
}

/* ------------------------- 9. Executing commands ------------------------- */

console.log("\n== Commands ==");

function execCommand(source: string, input: string | null = null) {
  const memory: Record<string, { type: DataType; value: Value | null }> = {};
  for (const { id, type } of VARIABLES) memory[id] = { type, value: null };
  const state: any = {
    memory,
    input,
    interaction: [],
    outPort: null,
    rand: 1,
  };
  semantics(grammar.match(source, "Command")).exec(state);
  return state;
}

{
  // A real variable must hold a real, even when the expression assigned to it
  // was an integer -- otherwise its declared type and its value disagree.
  const state = execCommand("assign x = 1");
  check(
    "assigning an integer to a real stores a real",
    state.memory.x.value === 1 && typeof state.memory.x.value === "number",
    `  got ${state.memory.x.value} (${typeof state.memory.x.value})`,
  );
}

check(
  "assigning an integer to an integer stores an integer",
  execCommand("assign n = 1").memory.n.value === 1n,
);

check("reading an integer", execCommand("read n", "42").memory.n.value === 42n);

check(
  "reading a real",
  execCommand("read x", "42").memory.x.value === 42 &&
    typeof execCommand("read x", "42").memory.x.value === "number",
);

{
  // Reading never converts: a real is not valid input for an integer.
  let message: string | null = null;
  try {
    execCommand("read n", "3.5");
  } catch (error) {
    message = error.message;
  }
  check(
    "reading 3.5 into an integer is an error",
    message === "RuntimeError_InvalidInput",
    `  got ${message}`,
  );
}

/* ----------------------- 10. Running a flowchart ------------------------- */

console.log("\n== Running the factorial example ==");

function runFlowchart(simple: SimpleFlowchart, inputs: string[]): string[] {
  const flowchart = {
    title: simple.title,
    variables: simple.variables,
    nodes: simple.nodes.map((node) => ({
      id: node.id,
      position: node.position,
      data: {
        role: node.role,
        payload: node.payload,
        handlePositions: node.handlePositions,
      },
    })),
    edges: simple.edges.map((edge, index) => ({ id: `e${index}`, ...edge })),
  } as unknown as Flowchart;

  const memory: Record<string, { type: DataType; value: Value | null }> = {};
  for (const { id, type } of flowchart.variables) {
    memory[id] = { type, value: null };
  }
  let state: any = {
    curNodeId: null,
    timeSlot: 0,
    memory,
    input: null,
    outPort: null,
    rand: 1,
    interaction: [],
    status: "ready",
    errors: [],
  };

  const pending = [...inputs];
  for (let step = 0; step < 10000; step += 1) {
    if (state.status === "halted" || state.status === "exception") break;
    if (state.status === "waiting") state.input = pending.shift() ?? "0";
    state = execute(flowchart, state);
  }
  if (state.status === "exception") {
    return [`exception: ${state.errors[0]?.message}`];
  }
  return state.interaction
    .filter((atom: any) => atom.direction === "out")
    .map((atom: any) => atom.text);
}

{
  let expected = 1n;
  for (let i = 1n; i <= 30n; i += 1n) expected *= i;
  const output = runFlowchart(factorial, ["30"]);
  check(
    "30! is computed exactly",
    output.length === 1 && output[0] === expected.toString(),
    `  got ${JSON.stringify(output)}, expected ${expected}`,
  );
}

/* ------------------------ 11. One vocabulary for types ------------------- */

console.log("\n== Type names ==");

{
  // The variables panel and the generated pseudocode must call each type by the
  // same name. They drifted apart once (`booleano` in the panel against
  // `lógico` in the pseudocode, for the same program), so this pins them.
  const ptBR: Record<string, string> = strings["pt-BR"];
  const variables = [Integer, Real, Boolean, String].map((type, index) => ({
    id: `v${index}`,
    type,
  }));
  const emitted = emitPseudocode(variables, [])
    .split("\n")
    .slice(1, 1 + variables.length)
    .map((line) => line.trim().split(": ")[1]);
  const shown = variables.map(({ type }) => ptBR[`DataType_${type}`]);
  check(
    "the pseudocode and the variables panel agree",
    JSON.stringify(emitted) === JSON.stringify(shown),
    `  pseudocode ${JSON.stringify(emitted)} vs panel ${JSON.stringify(shown)}`,
  );
}

/* --------------------------------- Exit ---------------------------------- */

console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} FAILED.`);
process.exit(failures === 0 ? 0 : 1);
