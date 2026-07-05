/*  Test runner for src/core/pseudocode.ts
 *
 *  Usage:  npx tsx tests/pseudocode/run.ts
 *
 *  1. Round-trip: each fixtures/*.pseudo file is parsed (with pseudo.ohm),
 *     converted into a flowchart, converted back into pseudocode, and the
 *     result is compared with the original file.
 *  2. Built-in examples: every flowchart in src/examples must be detected
 *     as structured, and its pseudocode must parse with pseudo.ohm.
 *  3. Negative cases: hand-built unstructured flowcharts must be rejected.
 *  4. Negation cases: loops/branches taken on the `false` handle.
 */
import * as fs from "fs";
import * as ohm from "ohm-js";
import * as path from "path";
import { fileURLToPath } from "url";

import { DataType } from "~/core/dataTypes";
import flowchartToPseudocode, {
  Stmt,
  isStructured,
  negateExpression,
  structurize,
} from "~/core/pseudocode";
import { Role } from "~/core/roles";
import examples from "~/examples";
import { SimpleFlowchart } from "~/store/serialize";
import { Flowchart } from "~/store/useStoreFlowchart";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(DIR, "fixtures");

/* ------------------------- Grammar and parsing --------------------------- */

const grammarSource =
  fs.readFileSync(path.join(FIXTURES, "base.ohm"), "utf8") +
  fs.readFileSync(path.join(FIXTURES, "pseudo.ohm"), "utf8");
const pseudoGrammar = ohm.grammars(grammarSource).PseudoLang;

interface ParsedProgram {
  variables: Array<{ id: string; type: DataType }>;
  program: Stmt[];
}

const TYPE_BY_NAME: Record<string, DataType> = {
  número: DataType.Number,
  lógico: DataType.Boolean,
  texto: DataType.String,
};

const semantics = pseudoGrammar.createSemantics().addOperation<any>("ast", {
  Program(_nl1, _kwVars, _nl2, decls, _kwStart, _nl3, commands, _kwEnd, _nl4) {
    const variables = [];
    for (const decl of decls.children) {
      const { ids, type } = decl.ast();
      for (const id of ids) variables.push({ id, type });
    }
    return { variables, program: commands.children.map((c) => c.ast()) };
  },
  VariableDeclaration(ids, _colon, type, _nl) {
    return {
      ids: ids.asIteration().children.map((c) => c.sourceString),
      type: TYPE_BY_NAME[type.sourceString],
    };
  },
  Command_read(_kw, ids, _nl) {
    return { kind: "read", payload: ids.sourceString };
  },
  Command_write(_kw, exprs, _nl) {
    return { kind: "write", payload: exprs.sourceString };
  },
  Command_assign(id, _eq, expr, _nl) {
    return {
      kind: "assign",
      payload: `${id.sourceString} = ${expr.sourceString}`,
    };
  },
  Command_if(ifClause, elseIfClauses, elseClause, _kwEnd, _nl) {
    const first = ifClause.ast();
    const chain = elseIfClauses.children.map((c) => c.ast());
    let rest: Stmt[] =
      elseClause.children.length > 0 ? elseClause.children[0].ast() : [];
    for (const clause of chain.reverse()) {
      rest = [{ kind: "if", test: clause.test, then: clause.then, else: rest }];
    }
    return { kind: "if", test: first.test, then: first.then, else: rest };
  },
  IfClause(_kw, expr, _nl, commands) {
    return {
      test: expr.sourceString,
      then: commands.children.map((c) => c.ast()),
    };
  },
  ElseIfClause(_kw, expr, _nl, commands) {
    return {
      test: expr.sourceString,
      then: commands.children.map((c) => c.ast()),
    };
  },
  ElseClause(_kw, _nl, commands) {
    return commands.children.map((c) => c.ast());
  },
  Command_while(_kw, expr, _nl1, commands, _kwEnd, _nl2) {
    return {
      kind: "while",
      test: expr.sourceString,
      body: commands.children.map((c) => c.ast()),
    };
  },
  Command_doWhile(_kwDo, _nl1, commands, _kwWhile, expr, _nl2) {
    return {
      kind: "doWhile",
      body: commands.children.map((c) => c.ast()),
      test: expr.sourceString,
    };
  },
});

function parsePseudocode(source: string): ParsedProgram {
  const match = pseudoGrammar.match(source, "Program");
  if (match.failed()) throw new Error(match.message);
  return semantics(match).ast();
}

/* --------------------- Pseudocode --> flowchart --------------------------- *
 *  Builds a flowchart for a parsed program (also usable as an "import
 *  pseudocode" feature).  Layout positions are dummies.                     */

interface Endpoint {
  source: string;
  handle: string;
}

function buildFlowchart(parsed: ParsedProgram): Flowchart {
  const nodes: Array<{ id: string; role: Role; payload: string }> = [];
  const edges: Array<{ source: string; sourceHandle: string; target: string }> =
    [];

  function newNode(role: Role, payload: string): string {
    const id = nodes.length.toString();
    nodes.push({ id, role, payload });
    return id;
  }

  function wire(endpoints: Endpoint[], target: string): void {
    for (const { source, handle } of endpoints) {
      edges.push({ source, sourceHandle: handle, target });
    }
  }

  function buildStmt(stmt: Stmt, incoming: Endpoint[]): Endpoint[] {
    switch (stmt.kind) {
      case "read":
      case "write":
      case "assign": {
        const id = newNode(stmt.kind as unknown as Role, stmt.payload);
        wire(incoming, id);
        return [{ source: id, handle: "out" }];
      }
      case "if": {
        const id = newNode(Role.Conditional, stmt.test);
        wire(incoming, id);
        const thenExits = buildStmts(stmt.then, [
          { source: id, handle: "true" },
        ]);
        const elseExits = buildStmts(stmt.else, [
          { source: id, handle: "false" },
        ]);
        return [...thenExits, ...elseExits];
      }
      case "while": {
        const id = newNode(Role.Conditional, stmt.test);
        wire(incoming, id);
        const bodyExits = buildStmts(stmt.body, [
          { source: id, handle: "true" },
        ]);
        wire(bodyExits, id);
        return [{ source: id, handle: "false" }];
      }
      case "doWhile": {
        const mark = nodes.length;
        const bodyExits = buildStmts(stmt.body, incoming);
        const id = newNode(Role.Conditional, stmt.test);
        wire(bodyExits, id);
        const entry = nodes.length > mark + 1 ? nodes[mark].id : id;
        edges.push({ source: id, sourceHandle: "true", target: entry });
        return [{ source: id, handle: "false" }];
      }
    }
  }

  function buildStmts(stmts: Stmt[], incoming: Endpoint[]): Endpoint[] {
    let current = incoming;
    for (const stmt of stmts) current = buildStmt(stmt, current);
    return current;
  }

  const startId = newNode(Role.Start, "");
  const exits = buildStmts(parsed.program, [
    { source: startId, handle: "out" },
  ]);
  const endId = newNode(Role.End, "");
  wire(exits, endId);

  return makeFlowchart(parsed.variables, nodes, edges);
}

function makeFlowchart(
  variables: Array<{ id: string; type: DataType }>,
  nodes: Array<{ id: string; role: Role; payload: string }>,
  edges: Array<{ source: string; sourceHandle: string; target: string }>,
): Flowchart {
  return {
    title: "",
    variables,
    nodes: nodes.map(({ id, role, payload }, index) => ({
      id,
      position: { x: 0, y: 80 * index },
      data: { role, payload, handlePositions: {} },
    })),
    edges: edges.map((edge, index) => ({ id: `e${index}`, ...edge })),
  } as unknown as Flowchart;
}

function simpleToFlowchart(simple: SimpleFlowchart): Flowchart {
  return {
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
}

/* ------------------------------ Test helpers ----------------------------- */

let failures = 0;

function check(label: string, ok: boolean, details = ""): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : "\n" + details}`);
  if (!ok) failures += 1;
}

function bodyOf(pseudocode: string): string {
  return pseudocode.slice(pseudocode.indexOf("Início"));
}

/* ------------------------- 1. Round-trip tests --------------------------- */

console.log("== Round-trip: fixtures/*.pseudo -> flowchart -> pseudocode ==");
const fixtureFiles = fs
  .readdirSync(FIXTURES)
  .filter((name) => name.endsWith(".pseudo"))
  .sort();
for (const name of fixtureFiles) {
  const original = fs.readFileSync(path.join(FIXTURES, name), "utf8");
  const parsed = parsePseudocode(original);
  const flowchart = buildFlowchart(parsed);
  const result = flowchartToPseudocode(flowchart);
  if (!result.ok) {
    check(name, false, `  not structured: ${JSON.stringify(result)}`);
    continue;
  }
  const grammarOk = pseudoGrammar
    .match(result.pseudocode, "Program")
    .succeeded();
  const bodyOk = bodyOf(result.pseudocode) === bodyOf(original);
  const reparsed = parsePseudocode(result.pseudocode);
  const varsOk =
    JSON.stringify(reparsed.variables) === JSON.stringify(parsed.variables);
  check(
    name,
    grammarOk && bodyOk && varsOk,
    `  grammar=${grammarOk} vars=${varsOk} body diff:\n--- expected ---\n` +
      `${bodyOf(original)}--- actual ---\n${bodyOf(result.pseudocode)}`,
  );
}

/* --------------------- 2. Built-in example flowcharts -------------------- */

console.log("\n== Built-in examples (src/examples) ==");
for (const simple of examples) {
  const result = flowchartToPseudocode(simpleToFlowchart(simple));
  const grammarOk =
    result.ok && pseudoGrammar.match(result.pseudocode, "Program").succeeded();
  check(
    `example "${simple.title}"`,
    result.ok === true && grammarOk,
    `  ${JSON.stringify(result)}`,
  );
  if (result.ok) {
    console.log(
      result.pseudocode
        .split("\n")
        .map((line) => "      | " + line)
        .join("\n"),
    );
  }
}

/* --------------------------- 3. Negative cases ---------------------------- */

console.log("\n== Unstructured flowcharts must be rejected ==");

type N = [string, Role, string];
type E = [string, string, string];
function chart(nodes: N[], edges: E[]): Flowchart {
  return makeFlowchart(
    [],
    nodes.map(([id, role, payload]) => ({ id, role, payload })),
    edges.map(([source, sourceHandle, target]) => ({
      source,
      sourceHandle,
      target,
    })),
  );
}

// (a) Jump into the middle of a loop body (loop with two entry points).
const jumpIntoLoop = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.Conditional, "skip"],
    ["2", Role.Conditional, "x > 0"],
    ["3", Role.Assign, "x = x - 1"],
    ["4", Role.Assign, "y = y + 1"],
    ["5", Role.Write, "y"],
    ["6", Role.End, ""],
  ],
  [
    ["0", "out", "1"],
    ["1", "true", "4"], // Second entry, into the middle of the loop body.
    ["1", "false", "2"],
    ["2", "true", "3"],
    ["3", "out", "4"],
    ["4", "out", "2"], // Back edge: loop body is {3, 4}.
    ["2", "false", "5"],
    ["5", "out", "6"],
  ],
);
check("jump into loop body", !isStructured(jumpIntoLoop));

// (b) Loop with the test in the middle: A; while (c) { B; A; } needs
//     duplication of A, hence not structured.
const midTestLoop = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.Assign, "x = x + 1"],
    ["2", Role.Conditional, "x < 10"],
    ["3", Role.Write, "x"],
    ["4", Role.End, ""],
  ],
  [
    ["0", "out", "1"],
    ["1", "out", "2"],
    ["2", "true", "3"],
    ["3", "out", "1"],
    ["2", "false", "4"],
  ],
);
check("loop with test in the middle", !isStructured(midTestLoop));

// (c) While loop with a break-like early exit.
const loopWithBreak = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.Conditional, "i < 10"],
    ["2", Role.Conditional, "found"],
    ["3", Role.Assign, "i = i + 1"],
    ["4", Role.Write, "i"],
    ["5", Role.End, ""],
  ],
  [
    ["0", "out", "1"],
    ["1", "true", "2"],
    ["2", "true", "4"], // Early exit ("break").
    ["2", "false", "3"],
    ["3", "out", "1"],
    ["1", "false", "4"],
    ["4", "out", "5"],
  ],
);
check("loop with early exit (break)", !isStructured(loopWithBreak));

// (d) Two conditionals sharing a branch target ("if (c1 || c2)" shape).
const sharedBranch = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.Conditional, "a > 0"],
    ["2", Role.Conditional, "b > 0"],
    ["3", Role.Write, '"yes"'],
    ["4", Role.Write, '"no"'],
    ["5", Role.End, ""],
  ],
  [
    ["0", "out", "1"],
    ["1", "true", "3"],
    ["1", "false", "2"],
    ["2", "true", "3"], // Same target as 1-true.
    ["2", "false", "4"],
    ["3", "out", "5"],
    ["4", "out", "5"],
  ],
);
check("branches merging before the join", !isStructured(sharedBranch));

const unstructuredResult = structurize(loopWithBreak);
check(
  "unstructured result reports offending nodes",
  !unstructuredResult.ok &&
    unstructuredResult.reason === "unstructured" &&
    unstructuredResult.nodeIds.length > 0,
  `  ${JSON.stringify(unstructuredResult)}`,
);

/* ------------------- 4. Negated loops and branches ------------------------ */

console.log("\n== Loops/branches on the false handle (negation) ==");

const whileOnFalse = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.Conditional, "n == 1"],
    ["2", Role.Assign, "n = n - 1"],
    ["3", Role.End, ""],
  ],
  [
    ["0", "out", "1"],
    ["1", "false", "2"],
    ["2", "out", "1"],
    ["1", "true", "3"],
  ],
);
{
  const result = flowchartToPseudocode(whileOnFalse);
  check(
    "while on false handle flips comparator",
    result.ok && result.pseudocode.includes("Enquanto n != 1"),
    `  ${JSON.stringify(result)}`,
  );
}

const ifOnFalse = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.Conditional, "ok && ready"],
    ["2", Role.Write, '"not yet"'],
    ["3", Role.End, ""],
  ],
  [
    ["0", "out", "1"],
    ["1", "false", "2"],
    ["2", "out", "3"],
    ["1", "true", "3"],
  ],
);
{
  const result = flowchartToPseudocode(ifOnFalse);
  const okParse =
    result.ok && pseudoGrammar.match(result.pseudocode, "Program").succeeded();
  check(
    "if on false handle wraps with !(...)",
    result.ok && okParse && result.pseudocode.includes("Se !(ok && ready)"),
    `  ${JSON.stringify(result)}`,
  );
}

check('negate "x <= y + 1"', negateExpression("x <= y + 1") === "x > y + 1");
check('negate "!(a && b)"', negateExpression("!(a && b)") === "(a && b)");
check('negate "!found"', negateExpression("!found") === "found");
check(
  'negate "(a < b) && c"',
  negateExpression("(a < b) && c") === "!((a < b) && c)",
);
check(
  'negate "f(x, \\")\\") == 2"',
  negateExpression('f(x, ")") == 2') === 'f(x, ")") != 2',
);

/* ----------------------------- 5. Edge cases ------------------------------ */

console.log("\n== Edge cases ==");

const emptyProgram = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.End, ""],
  ],
  [["0", "out", "1"]],
);
{
  const result = flowchartToPseudocode(emptyProgram);
  check(
    "empty program",
    result.ok &&
      result.pseudocode === "Variáveis\nInício\nFim\n" &&
      pseudoGrammar.match(result.pseudocode, "Program").succeeded(),
    `  ${JSON.stringify(result)}`,
  );
}

const multipleEnds = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.Conditional, "x > 0"],
    ["2", Role.Write, '"pos"'],
    ["3", Role.Write, '"neg"'],
    ["4", Role.End, ""],
    ["5", Role.End, ""],
  ],
  [
    ["0", "out", "1"],
    ["1", "true", "2"],
    ["1", "false", "3"],
    ["2", "out", "4"],
    ["3", "out", "5"],
  ],
);
{
  const result = flowchartToPseudocode(multipleEnds);
  check(
    "two end nodes are merged into a single exit",
    result.ok && bodyOf(result.pseudocode).includes("Senão"),
    `  ${JSON.stringify(result)}`,
  );
}

const missingEdge = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.Conditional, "x > 0"],
    ["2", Role.End, ""],
  ],
  [
    ["0", "out", "1"],
    ["1", "true", "2"],
    // Missing: false branch of node 1.
  ],
);
{
  const result = structurize(missingEdge);
  check(
    "missing outgoing edge -> invalid",
    !result.ok && result.reason === "invalid" && result.nodeIds[0] === "1",
    `  ${JSON.stringify(result)}`,
  );
}

const disconnectedFragment = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.Write, "x"],
    ["2", Role.End, ""],
    ["3", Role.Read, "x"], // Disconnected fragment: 3 --> 4.
    ["4", Role.End, ""],
  ],
  [
    ["0", "out", "1"],
    ["1", "out", "2"],
    ["3", "out", "4"],
  ],
);
{
  const result = structurize(disconnectedFragment);
  check(
    "disconnected fragment -> invalid",
    !result.ok &&
      result.reason === "invalid" &&
      JSON.stringify([...result.nodeIds].sort()) === '["3","4"]',
    `  ${JSON.stringify(result)}`,
  );
}

const detachedCycle = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.End, ""],
    ["2", Role.Assign, "x = x + 1"], // Detached cycle: 2 <--> 3.
    ["3", Role.Assign, "x = x - 1"],
  ],
  [
    ["0", "out", "1"],
    ["2", "out", "3"],
    ["3", "out", "2"],
  ],
);
{
  const result = structurize(detachedCycle);
  check(
    "detached cycle -> invalid",
    !result.ok &&
      result.reason === "invalid" &&
      JSON.stringify([...result.nodeIds].sort()) === '["2","3"]',
    `  ${JSON.stringify(result)}`,
  );
}

// The self loop is placed behind a guard so that the flowchart stays valid:
// an orphaned end block would now be reported as unreachable.
const infiniteSelfLoop = chart(
  [
    ["0", Role.Start, ""],
    ["1", Role.Conditional, "x > 0"],
    ["2", Role.Assign, "x = x + 1"],
    ["3", Role.End, ""],
  ],
  [
    ["0", "out", "1"],
    ["1", "true", "2"],
    ["2", "out", "2"], // Self loop.
    ["1", "false", "3"],
  ],
);
{
  const result = flowchartToPseudocode(infiniteSelfLoop);
  check(
    "self loop becomes Enquanto true",
    result.ok && result.pseudocode.includes("Enquanto true"),
    `  ${JSON.stringify(result)}`,
  );
}

console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} FAILED.`);
process.exit(failures === 0 ? 0 : 1);
