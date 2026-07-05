/*  Test runner for src/core/check.ts
 *
 *  Usage:  npx vite-node src/tests/check/run.ts
 *
 *  (vite-node, rather than tsx, is required because check.ts loads the
 *  grammar through a Vite `?raw` import.)
 *
 *  1. A well-formed flowchart must produce no errors.
 *  2. A disconnected fragment (e.g., read -> end) must be reported as
 *     unreachable, even though all of its output handles are connected.
 *  3. A detached cycle must be reported as unreachable; note that its
 *     blocks do have incoming edges.
 *  4. Without a start block, only the missing-start error is reported
 *     (no unreachable-block noise).
 *  5. All built-in examples must pass the check with no errors.
 */
import checkFlowchart from "~/core/check";
import { DataType } from "~/core/dataTypes";
import { Role } from "~/core/roles";
import examples from "~/examples";
import { SimpleFlowchart } from "~/store/serialize";
import { Flowchart } from "~/store/useStoreFlowchart";
import { MachineError } from "~/store/useStoreMachine";

/* ------------------------------- Builders -------------------------------- */

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

/* ----------------------------- Test helpers ------------------------------ */

let failures = 0;

function check(label: string, ok: boolean, details = ""): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : "\n" + details}`);
  if (!ok) failures += 1;
}

function summarize(errors: MachineError[]): string {
  return JSON.stringify(
    errors.map(({ message, nodeId }) => ({ message, nodeId })),
  );
}

/* ------------------------- 1. Well-formed flowchart ---------------------- */

console.log("== Structural checks (src/core/check.ts) ==");

const xNumber = [{ id: "x", type: DataType.Number }];

const connected = makeFlowchart(
  xNumber,
  [
    { id: "0", role: Role.Start, payload: "" },
    { id: "1", role: Role.Read, payload: "x" },
    { id: "2", role: Role.Write, payload: "x" },
    { id: "3", role: Role.End, payload: "" },
  ],
  [
    { source: "0", sourceHandle: "out", target: "1" },
    { source: "1", sourceHandle: "out", target: "2" },
    { source: "2", sourceHandle: "out", target: "3" },
  ],
);
{
  const errors = checkFlowchart(connected);
  check(
    "well-formed flowchart has no errors",
    errors.length === 0,
    `  ${summarize(errors)}`,
  );
}

/* ---------------------- 2. Disconnected fragment ------------------------- */

const withFragment = makeFlowchart(
  xNumber,
  [
    { id: "0", role: Role.Start, payload: "" },
    { id: "1", role: Role.Read, payload: "x" },
    { id: "2", role: Role.Write, payload: "x" },
    { id: "3", role: Role.End, payload: "" },
    { id: "4", role: Role.Read, payload: "x" }, // disconnected fragment
    { id: "5", role: Role.End, payload: "" },
  ],
  [
    { source: "0", sourceHandle: "out", target: "1" },
    { source: "1", sourceHandle: "out", target: "2" },
    { source: "2", sourceHandle: "out", target: "3" },
    { source: "4", sourceHandle: "out", target: "5" },
  ],
);
{
  const errors = checkFlowchart(withFragment);
  const unreachableIds = errors
    .filter(({ message }) => message === "CheckError_Unreachable")
    .map(({ nodeId }) => nodeId)
    .sort();
  check(
    "disconnected fragment is reported as unreachable",
    errors.length === 2 && JSON.stringify(unreachableIds) === '["4","5"]',
    `  ${summarize(errors)}`,
  );
}

/* -------------------------- 3. Detached cycle ---------------------------- */

const withCycle = makeFlowchart(
  xNumber,
  [
    { id: "0", role: Role.Start, payload: "" },
    { id: "1", role: Role.End, payload: "" },
    { id: "2", role: Role.Assign, payload: "x = x + 1" }, // detached cycle
    { id: "3", role: Role.Assign, payload: "x = x - 1" },
  ],
  [
    { source: "0", sourceHandle: "out", target: "1" },
    { source: "2", sourceHandle: "out", target: "3" },
    { source: "3", sourceHandle: "out", target: "2" },
  ],
);
{
  const errors = checkFlowchart(withCycle);
  const unreachableIds = errors
    .filter(({ message }) => message === "CheckError_Unreachable")
    .map(({ nodeId }) => nodeId)
    .sort();
  check(
    "detached cycle is reported as unreachable",
    errors.length === 2 && JSON.stringify(unreachableIds) === '["2","3"]',
    `  ${summarize(errors)}`,
  );
}

/* --------------------------- 4. No start block --------------------------- */

const noStart = makeFlowchart(
  xNumber,
  [
    { id: "0", role: Role.Read, payload: "x" },
    { id: "1", role: Role.End, payload: "" },
  ],
  [{ source: "0", sourceHandle: "out", target: "1" }],
);
{
  const errors = checkFlowchart(noStart);
  const hasNoStart = errors.some(
    ({ message }) => message === "CheckError_NoStart",
  );
  const hasUnreachable = errors.some(
    ({ message }) => message === "CheckError_Unreachable",
  );
  check(
    "missing start is reported without unreachable-block noise",
    hasNoStart && !hasUnreachable,
    `  ${summarize(errors)}`,
  );
}

/* ------------------------- 5. Built-in examples --------------------------- */

console.log("\n== Built-in examples (src/examples) ==");
for (const simple of examples) {
  const errors = checkFlowchart(simpleToFlowchart(simple));
  check(
    `example "${simple.title}"`,
    errors.length === 0,
    `  ${summarize(errors)}`,
  );
}

/* --------------------------------- Exit ---------------------------------- */

console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} FAILED.`);
process.exit(failures === 0 ? 0 : 1);
