/*  Test runner for the block numbering in src/core/graph.ts
 *
 *  Usage:  npx vite-node src/tests/graph/run.ts
 *
 *  1. A straight sequence is numbered in the order it is written, whatever
 *     the ids are.
 *  2. A loop: the body comes before the block the F branch leads to.
 *  3. An if/else: the T branch, then the F branch, then the block they join
 *     into -- which is the point of holding a block back until every block
 *     that leads to it has been numbered.
 *  4. Unreachable blocks are numbered last, and do not hold back a block the
 *     program does run.
 *  5. Degenerate flowcharts (no start block, a loop with two entry points)
 *     still get a total numbering.
 *  6. All built-in examples are numbered exactly by their ids, which is what
 *     keeps the files readable in the order the flow runs.
 */
import { getNodeNumbers } from "~/core/graph";
import { Role } from "~/core/roles";
import examples from "~/examples";
import { SimpleFlowchart } from "~/store/serialize";
import { Flowchart } from "~/store/useStoreFlowchart";

/* ------------------------------- Builders -------------------------------- */

function makeFlowchart(
  nodes: Array<{ id: string; role: Role }>,
  edges: Array<{ source: string; sourceHandle: string; target: string }>,
): Flowchart {
  return {
    title: "",
    variables: [],
    nodes: nodes.map(({ id, role }, index) => ({
      id,
      position: { x: 0, y: 80 * index },
      data: { role, payload: "", handlePositions: {} },
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

//  The ids in the order they are numbered, which is easier to read (and to
//  write down) than the map itself.
function numbering(flowchart: Flowchart): string[] {
  const numbers = getNodeNumbers(flowchart);
  return [...numbers.entries()].sort((a, b) => a[1] - b[1]).map(([id]) => id);
}

function checkOrder(label: string, flowchart: Flowchart, expected: string[]) {
  const actual = numbering(flowchart);
  check(
    label,
    actual.length === expected.length &&
      actual.every((id, index) => id === expected[index]),
    `  expected [${expected.join(" ")}], got [${actual.join(" ")}]`,
  );
}

/* ------------------------------ 1. Sequence ------------------------------ */

console.log("== Block numbering (src/core/graph.ts) ==");

//  The flowchart of the `factorial` example as it used to be written: the
//  `Leia` was added after the assignment below it and kept the larger id.
checkOrder(
  "creation order does not leak into the numbering",
  makeFlowchart(
    [
      { id: "0", role: Role.Start },
      { id: "1", role: Role.Assign },
      { id: "2", role: Role.Read },
      { id: "3", role: Role.End },
    ],
    [
      { source: "0", sourceHandle: "out", target: "2" },
      { source: "2", sourceHandle: "out", target: "1" },
      { source: "1", sourceHandle: "out", target: "3" },
    ],
  ),
  ["0", "2", "1", "3"],
);

/* -------------------------------- 2. Loop -------------------------------- */

//  start -> read -> while (cond) { body; step } -> write -> end
checkOrder(
  "a loop is numbered body first, then the block after it",
  makeFlowchart(
    [
      { id: "0", role: Role.Start },
      { id: "1", role: Role.Read },
      { id: "2", role: Role.Conditional },
      { id: "3", role: Role.Assign },
      { id: "4", role: Role.Assign },
      { id: "5", role: Role.Write },
      { id: "6", role: Role.End },
    ],
    [
      { source: "0", sourceHandle: "out", target: "1" },
      { source: "1", sourceHandle: "out", target: "2" },
      { source: "2", sourceHandle: "true", target: "3" },
      { source: "3", sourceHandle: "out", target: "4" },
      { source: "4", sourceHandle: "out", target: "2" },
      { source: "2", sourceHandle: "false", target: "5" },
      { source: "5", sourceHandle: "out", target: "6" },
    ],
  ),
  ["0", "1", "2", "3", "4", "5", "6"],
);

/* ------------------------------- 3. If/else ------------------------------ */

//  Both branches lead to the same block. A plain depth-first walk would number
//  that block (and the end) inside the T branch, pushing the F branch to 5.
checkOrder(
  "an if/else is numbered T branch, F branch, then the join",
  makeFlowchart(
    [
      { id: "0", role: Role.Start },
      { id: "1", role: Role.Conditional },
      { id: "2", role: Role.Assign },
      { id: "3", role: Role.Assign },
      { id: "4", role: Role.Write },
      { id: "5", role: Role.End },
    ],
    [
      { source: "0", sourceHandle: "out", target: "1" },
      { source: "1", sourceHandle: "true", target: "2" },
      { source: "1", sourceHandle: "false", target: "3" },
      { source: "2", sourceHandle: "out", target: "4" },
      { source: "3", sourceHandle: "out", target: "4" },
      { source: "4", sourceHandle: "out", target: "5" },
    ],
  ),
  ["0", "1", "2", "3", "4", "5"],
);

//  Handle order, not edge order: the T branch goes first even when its edge
//  was drawn last, and even when it points at the block with the larger id.
checkOrder(
  "the T branch is walked before the F branch",
  makeFlowchart(
    [
      { id: "0", role: Role.Start },
      { id: "1", role: Role.Conditional },
      { id: "2", role: Role.Write },
      { id: "3", role: Role.Write },
      { id: "4", role: Role.End },
    ],
    [
      { source: "0", sourceHandle: "out", target: "1" },
      { source: "1", sourceHandle: "false", target: "2" },
      { source: "1", sourceHandle: "true", target: "3" },
      { source: "2", sourceHandle: "out", target: "4" },
      { source: "3", sourceHandle: "out", target: "4" },
    ],
  ),
  ["0", "1", "3", "2", "4"],
);

/* ---------------------------- 4. Unreachable ----------------------------- */

//  Block 9 is dead code that points at the end block. It must not hold the end
//  block back, and it is numbered after everything the program runs.
checkOrder(
  "unreachable blocks come last and hold nothing back",
  makeFlowchart(
    [
      { id: "0", role: Role.Start },
      { id: "1", role: Role.Write },
      { id: "2", role: Role.End },
      { id: "9", role: Role.Assign },
    ],
    [
      { source: "0", sourceHandle: "out", target: "1" },
      { source: "1", sourceHandle: "out", target: "2" },
      { source: "9", sourceHandle: "out", target: "2" },
    ],
  ),
  ["0", "1", "2", "9"],
);

/* ---------------------------- 5. Degenerate ------------------------------ */

//  While the student is still building, there may be no start block at all.
checkOrder(
  "without a start block, everything is numbered by id",
  makeFlowchart(
    [
      { id: "2", role: Role.Write },
      { id: "0", role: Role.Read },
      { id: "10", role: Role.End },
    ],
    [{ source: "0", sourceHandle: "out", target: "2" }],
  ),
  ["0", "2", "10"],
);

//  A loop entered at two different blocks (2 from the T branch, 3 from the F
//  branch) is not the shape of any pseudocode construct; all that is required
//  here is that every block still gets a number, exactly once.
{
  const flowchart = makeFlowchart(
    [
      { id: "0", role: Role.Start },
      { id: "1", role: Role.Conditional },
      { id: "2", role: Role.Assign },
      { id: "3", role: Role.Assign },
      { id: "4", role: Role.Conditional },
      { id: "5", role: Role.End },
    ],
    [
      { source: "0", sourceHandle: "out", target: "1" },
      { source: "1", sourceHandle: "true", target: "2" },
      { source: "1", sourceHandle: "false", target: "3" },
      { source: "2", sourceHandle: "out", target: "3" },
      { source: "3", sourceHandle: "out", target: "4" },
      { source: "4", sourceHandle: "true", target: "2" },
      { source: "4", sourceHandle: "false", target: "5" },
    ],
  );
  const actual = numbering(flowchart);
  check(
    "a loop with two entry points still numbers every block once",
    actual.length === 6 && new Set(actual).size === 6,
    `  got [${actual.join(" ")}]`,
  );
}

/* ------------------------- 6. Built-in examples -------------------------- */

console.log("\n== Built-in examples (src/examples) ==");
for (const simple of examples) {
  const actual = numbering(simpleToFlowchart(simple));
  const expected = actual.map((_id, index) => index.toString());
  check(
    `example "${simple.title}" is numbered by its ids`,
    actual.every((id, index) => id === expected[index]),
    `  expected [${expected.join(" ")}], got [${actual.join(" ")}]`,
  );
}

/* --------------------------------- Exit ---------------------------------- */

console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} FAILED.`);
process.exit(failures === 0 ? 0 : 1);
