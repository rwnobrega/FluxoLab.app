import _ from "lodash";

import { DataType } from "~/core/dataTypes";
import { Role } from "~/core/roles";
import { Flowchart } from "~/store/useStoreFlowchart";

/* ------------------------------------------------------------------------ *
 *  Structured pseudocode extraction.
 *
 *  A flowchart is *structured* if it can be built exclusively by nesting and
 *  concatenating single-entry/single-exit constructs: sequence, conditional
 *  (if / if-else), pre-tested loop (while) and post-tested loop (do-while).
 *
 *  The check works by graph reduction: each reduction rule is the inverse of
 *  one production of the pseudocode grammar.  The rules are applied until a
 *  fixed point is reached; the flowchart is structured if and only if the
 *  graph collapses to  [start] --> [exit].  While reducing, we accumulate an
 *  abstract syntax tree, which is then pretty-printed as pseudocode.
 * ------------------------------------------------------------------------ */

export type Stmt =
  | { kind: "read"; payload: string }
  | { kind: "write"; payload: string }
  | { kind: "assign"; payload: string }
  | { kind: "if"; test: string; then: Stmt[]; else: Stmt[] }
  | { kind: "while"; test: string; body: Stmt[] }
  | { kind: "doWhile"; body: Stmt[]; test: string };

export type StructurizeResult =
  | { ok: true; program: Stmt[] }
  | { ok: false; reason: "invalid" | "unstructured"; nodeIds: string[] };

export type PseudocodeResult =
  | { ok: true; pseudocode: string }
  | { ok: false; reason: "invalid" | "unstructured"; nodeIds: string[] };

/* ----------------------------- CFG vertices ------------------------------ */

const EXIT = "__exit__"; // All `end` nodes are merged into this single sink.

interface BlockVertex {
  kind: "block"; // Single entry, single exit.
  stmts: Stmt[];
  next: string;
}

interface CondVertex {
  kind: "cond"; // Single entry, two exits.
  test: string;
  nextTrue: string;
  nextFalse: string;
}

type Vertex = BlockVertex | CondVertex;

function successors(vertex: Vertex): string[] {
  return vertex.kind === "block"
    ? [vertex.next]
    : [vertex.nextTrue, vertex.nextFalse];
}

/* ------------------------- Flowchart --> CFG ----------------------------- */

function buildVertices(
  flowchart: Flowchart,
  startId: string,
): Map<string, Vertex> | { invalidIds: string[] } {
  const { nodes, edges } = flowchart;
  const nodeById = new Map<string, Flowchart["nodes"][number]>();
  for (const node of nodes) nodeById.set(node.id, node);
  const endIds = new Set(
    _.map(_.filter(nodes, { data: { role: Role.End } }), "id"),
  );

  const outgoing = new Map<string, string>();
  for (const edge of edges) {
    const key = `${edge.source}:${edge.sourceHandle}`;
    if (outgoing.has(key)) return { invalidIds: [edge.source] };
    outgoing.set(key, edge.target);
  }

  function follow(id: string, handle: string): string | null {
    const target = outgoing.get(`${id}:${handle}`);
    if (target === undefined || !nodeById.has(target)) return null;
    return endIds.has(target) ? EXIT : target;
  }

  // Only nodes reachable from `start` matter for the program's behavior.
  const vertices = new Map<string, Vertex>();
  const invalidIds: string[] = [];
  const seen = new Set<string>([startId]);
  const stack = [startId];
  while (stack.length > 0) {
    const id = stack.pop() as string;
    const node = nodeById.get(id);
    if (node === undefined) continue; // Unreachable: `follow` checks targets.
    const { role, payload } = node.data;
    let vertex: Vertex;
    if (role === Role.Conditional) {
      const nextTrue = follow(id, "true");
      const nextFalse = follow(id, "false");
      if (nextTrue === null || nextFalse === null) {
        invalidIds.push(id);
        continue;
      }
      vertex = { kind: "cond", test: payload, nextTrue, nextFalse };
    } else {
      const next = follow(id, "out");
      if (next === null) {
        invalidIds.push(id);
        continue;
      }
      const stmts: Stmt[] =
        role === Role.Start
          ? []
          : [{ kind: role as "read" | "write" | "assign", payload }];
      vertex = { kind: "block", stmts, next };
    }
    vertices.set(id, vertex);
    for (const succ of successors(vertex)) {
      if (succ !== EXIT && !seen.has(succ)) {
        seen.add(succ);
        stack.push(succ);
      }
    }
  }
  if (invalidIds.length > 0) return { invalidIds };
  return vertices;
}

/* --------------------------- Graph reduction ----------------------------- */

function computeIndegrees(
  vertices: Map<string, Vertex>,
  startId: string,
): Map<string, number> {
  const indegrees = new Map<string, number>();
  for (const id of vertices.keys()) indegrees.set(id, 0);
  indegrees.set(startId, 1); // Virtual edge for the program entry point.
  for (const vertex of vertices.values()) {
    for (const succ of successors(vertex)) {
      if (indegrees.has(succ)) {
        indegrees.set(succ, (indegrees.get(succ) as number) + 1);
      }
    }
  }
  return indegrees;
}

function reduceOnce(vertices: Map<string, Vertex>, startId: string): boolean {
  const indegrees = computeIndegrees(vertices, startId);
  const indegree = (id: string): number => indegrees.get(id) as number;

  for (const [id, vertex] of vertices) {
    if (vertex.kind === "block") {
      // [Self-loop]  b --> b  ~~>  Enquanto true { b }
      if (vertex.next === id) {
        vertex.stmts = [{ kind: "while", test: "true", body: vertex.stmts }];
        vertex.next = EXIT;
        return true;
      }
      const nextVertex = vertices.get(vertex.next);
      if (nextVertex === undefined) continue; // Successor is EXIT.
      // [Sequence]  b1 --> b2  ~~>  { b1; b2 }
      if (nextVertex.kind === "block" && indegree(vertex.next) === 1) {
        vertex.stmts = [...vertex.stmts, ...nextVertex.stmts];
        vertices.delete(vertex.next);
        vertex.next = nextVertex.next;
        return true;
      }
      // [Do-while]  b --> d,  d --true--> b   ~~>  Faça { b } enquanto d
      //             b --> d,  d --false-> b   ~~>  Faça { b } enquanto !d
      if (nextVertex.kind === "cond" && indegree(vertex.next) === 1) {
        if (nextVertex.nextTrue === id) {
          vertex.stmts = [
            { kind: "doWhile", body: vertex.stmts, test: nextVertex.test },
          ];
          vertices.delete(vertex.next);
          vertex.next = nextVertex.nextFalse;
          return true;
        }
        if (nextVertex.nextFalse === id) {
          vertex.stmts = [
            {
              kind: "doWhile",
              body: vertex.stmts,
              test: negateExpression(nextVertex.test),
            },
          ];
          vertices.delete(vertex.next);
          vertex.next = nextVertex.nextTrue;
          return true;
        }
      }
    } else {
      // [While, empty body]  d --true--> d  ~~>  Enquanto d {}
      if (vertex.nextTrue === id) {
        vertices.set(id, {
          kind: "block",
          stmts: [{ kind: "while", test: vertex.test, body: [] }],
          next: vertex.nextFalse,
        });
        return true;
      }
      if (vertex.nextFalse === id) {
        vertices.set(id, {
          kind: "block",
          stmts: [
            { kind: "while", test: negateExpression(vertex.test), body: [] },
          ],
          next: vertex.nextTrue,
        });
        return true;
      }
      const trueVertex = vertices.get(vertex.nextTrue);
      const falseVertex = vertices.get(vertex.nextFalse);
      // [While]  d --true--> b --> d  ~~>  Enquanto d { b }
      if (
        trueVertex?.kind === "block" &&
        indegree(vertex.nextTrue) === 1 &&
        trueVertex.next === id
      ) {
        vertices.delete(vertex.nextTrue);
        vertices.set(id, {
          kind: "block",
          stmts: [{ kind: "while", test: vertex.test, body: trueVertex.stmts }],
          next: vertex.nextFalse,
        });
        return true;
      }
      // [While, negated]  d --false--> b --> d  ~~>  Enquanto !d { b }
      if (
        falseVertex?.kind === "block" &&
        indegree(vertex.nextFalse) === 1 &&
        falseVertex.next === id
      ) {
        vertices.delete(vertex.nextFalse);
        vertices.set(id, {
          kind: "block",
          stmts: [
            {
              kind: "while",
              test: negateExpression(vertex.test),
              body: falseVertex.stmts,
            },
          ],
          next: vertex.nextTrue,
        });
        return true;
      }
      // [If-else]  d --true--> b1 --> m,  d --false--> b2 --> m
      if (
        trueVertex?.kind === "block" &&
        falseVertex?.kind === "block" &&
        vertex.nextTrue !== vertex.nextFalse &&
        indegree(vertex.nextTrue) === 1 &&
        indegree(vertex.nextFalse) === 1 &&
        trueVertex.next === falseVertex.next
      ) {
        vertices.delete(vertex.nextTrue);
        vertices.delete(vertex.nextFalse);
        vertices.set(id, {
          kind: "block",
          stmts: [
            {
              kind: "if",
              test: vertex.test,
              then: trueVertex.stmts,
              else: falseVertex.stmts,
            },
          ],
          next: trueVertex.next,
        });
        return true;
      }
      // [If]  d --true--> b --> m,  d --false--> m
      if (
        trueVertex?.kind === "block" &&
        indegree(vertex.nextTrue) === 1 &&
        trueVertex.next === vertex.nextFalse
      ) {
        vertices.delete(vertex.nextTrue);
        vertices.set(id, {
          kind: "block",
          stmts: [
            { kind: "if", test: vertex.test, then: trueVertex.stmts, else: [] },
          ],
          next: vertex.nextFalse,
        });
        return true;
      }
      // [If, negated]  d --false--> b --> m,  d --true--> m
      if (
        falseVertex?.kind === "block" &&
        indegree(vertex.nextFalse) === 1 &&
        falseVertex.next === vertex.nextTrue
      ) {
        vertices.delete(vertex.nextFalse);
        vertices.set(id, {
          kind: "block",
          stmts: [
            {
              kind: "if",
              test: negateExpression(vertex.test),
              then: falseVertex.stmts,
              else: [],
            },
          ],
          next: vertex.nextTrue,
        });
        return true;
      }
      // [If, empty]  d --true--> m,  d --false--> m
      if (vertex.nextTrue === vertex.nextFalse) {
        vertices.set(id, {
          kind: "block",
          stmts: [{ kind: "if", test: vertex.test, then: [], else: [] }],
          next: vertex.nextTrue,
        });
        return true;
      }
    }
  }
  return false;
}

export function structurize(flowchart: Flowchart): StructurizeResult {
  const startNodes = _.filter(flowchart.nodes, {
    data: { role: Role.Start },
  });
  if (startNodes.length !== 1) {
    return { ok: false, reason: "invalid", nodeIds: _.map(startNodes, "id") };
  }
  const startId = startNodes[0].id;

  const built = buildVertices(flowchart, startId);
  if (!(built instanceof Map)) {
    return { ok: false, reason: "invalid", nodeIds: built.invalidIds };
  }

  const vertices = built;
  while (reduceOnce(vertices, startId)) {
    // Keep reducing until a fixed point is reached.
  }

  const startVertex = vertices.get(startId) as Vertex;
  if (
    vertices.size === 1 &&
    startVertex.kind === "block" &&
    startVertex.next === EXIT
  ) {
    return { ok: true, program: startVertex.stmts };
  }
  const nodeIds = _.filter([...vertices.keys()], (id) => id !== startId);
  return { ok: false, reason: "unstructured", nodeIds };
}

export function isStructured(flowchart: Flowchart): boolean {
  return structurize(flowchart).ok;
}

/* -------------------------- Expression negation -------------------------- */

const FLIPPED_COMPARATORS: Record<string, string> = {
  "==": "!=",
  "!=": "==",
  "<=": ">",
  ">": "<=",
  ">=": "<",
  "<": ">=",
};

/*  Negates a boolean expression, favoring readable output: `true`/`false`
 *  are flipped, a leading `!` is stripped when it spans the whole
 *  expression, and a single top-level comparison has its operator flipped.
 *  In all other cases the expression is safely wrapped as `!(...)`.       */
export function negateExpression(expression: string): string {
  const src = expression.trim();
  if (src === "true") return "false";
  if (src === "false") return "true";
  if (src.startsWith("!") && isAtomic(src.slice(1).trim())) {
    return src.slice(1).trim();
  }

  let depth = 0;
  let index = 0;
  let comparator: { index: number; op: string } | null = null;
  let bailOut = false;
  while (index < src.length && !bailOut) {
    const char = src[index];
    if (char === '"') {
      index = skipStringLiteral(src, index);
      continue;
    }
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (depth === 0) {
      const two = src.slice(index, index + 2);
      if (two === "&&" || two === "||") {
        bailOut = true;
      } else if (two in FLIPPED_COMPARATORS) {
        bailOut = comparator !== null;
        comparator = { index, op: two };
        index += 2;
        continue;
      } else if (char === "<" || char === ">") {
        bailOut = comparator !== null;
        comparator = { index, op: char };
      } else if (char === "!") {
        bailOut = true; // Unary `!` not covering the whole expression.
      }
    }
    index += 1;
  }
  if (!bailOut && comparator !== null) {
    const { index: at, op } = comparator;
    return (
      src.slice(0, at) + FLIPPED_COMPARATORS[op] + src.slice(at + op.length)
    );
  }
  return `!(${src})`;
}

function skipStringLiteral(src: string, index: number): number {
  index += 1; // Skip the opening quote.
  while (index < src.length && src[index] !== '"') {
    index += src[index] === "\\" ? 2 : 1;
  }
  return index + 1; // Skip the closing quote.
}

function isAtomic(src: string): boolean {
  if (/^[\p{L}_][\p{L}\p{N}_]*$/u.test(src)) return true; // Identifier.
  if (!src.startsWith("(") || !src.endsWith(")")) return false;
  let depth = 0; // Parenthesized group spanning the whole expression?
  for (let index = 0; index < src.length; index += 1) {
    const char = src[index];
    if (char === '"') {
      index = skipStringLiteral(src, index) - 1;
      continue;
    }
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (depth === 0 && index < src.length - 1) return false;
  }
  return depth === 0;
}

/* --------------------------- Pretty-printing ----------------------------- */

const INDENT = "    ";

const DATA_TYPE_NAMES: Record<DataType, string> = {
  [DataType.Number]: "número",
  [DataType.Boolean]: "lógico",
  [DataType.String]: "texto",
};

function emitDeclarations(variables: Flowchart["variables"]): string[] {
  const lines: string[] = [];
  for (const variable of variables) {
    const typeName = DATA_TYPE_NAMES[variable.type];
    const lastLine = _.last(lines);
    if (lastLine !== undefined && lastLine.endsWith(`: ${typeName}`)) {
      const ids = lastLine.slice(0, -`: ${typeName}`.length);
      lines[lines.length - 1] = `${ids}, ${variable.id}: ${typeName}`;
    } else {
      lines.push(`${variable.id}: ${typeName}`);
    }
  }
  return lines;
}

function emitStmts(stmts: Stmt[], depth: number): string[] {
  const pad = INDENT.repeat(depth);
  const lines: string[] = [];
  for (const stmt of stmts) {
    switch (stmt.kind) {
      case "read":
        lines.push(`${pad}Leia ${stmt.payload}`);
        break;
      case "write":
        lines.push(`${pad}Escreva ${stmt.payload}`);
        break;
      case "assign":
        lines.push(`${pad}${stmt.payload}`);
        break;
      case "while":
        lines.push(`${pad}Enquanto ${stmt.test}`);
        lines.push(...emitStmts(stmt.body, depth + 1));
        lines.push(`${pad}FimEnquanto`);
        break;
      case "doWhile":
        lines.push(`${pad}Faça`);
        lines.push(...emitStmts(stmt.body, depth + 1));
        lines.push(`${pad}enquanto ${stmt.test}`);
        break;
      case "if": {
        let current = stmt;
        lines.push(`${pad}Se ${current.test}`);
        for (;;) {
          lines.push(...emitStmts(current.then, depth + 1));
          const rest = current.else;
          if (rest.length === 1 && rest[0].kind === "if") {
            current = rest[0]; // Collapse `Senão { Se ... }` into `SenãoSe`.
            lines.push(`${pad}SenãoSe ${current.test}`);
          } else {
            if (rest.length > 0) {
              lines.push(`${pad}Senão`);
              lines.push(...emitStmts(rest, depth + 1));
            }
            break;
          }
        }
        lines.push(`${pad}FimSe`);
        break;
      }
    }
  }
  return lines;
}

export function emitPseudocode(
  variables: Flowchart["variables"],
  program: Stmt[],
): string {
  const lines = [
    "Variáveis",
    ..._.map(emitDeclarations(variables), (line) => `${INDENT}${line}`),
    "Início",
    ...emitStmts(program, 1),
    "Fim",
  ];
  return lines.join("\n") + "\n";
}

/* ------------------------------ Main entry ------------------------------- */

export default function flowchartToPseudocode(
  flowchart: Flowchart,
): PseudocodeResult {
  const result = structurize(flowchart);
  if (!result.ok) return result;
  return {
    ok: true,
    pseudocode: emitPseudocode(flowchart.variables, result.program),
  };
}
