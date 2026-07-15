import _ from "lodash";

import { DataType } from "~/core/dataTypes";
import { Role } from "~/core/roles";
import { Flowchart } from "~/store/useStoreFlowchart";
import { MachineState } from "~/store/useStoreMachine";

export interface TraceRow {
  // Zero-based step index (row 0 corresponds to the Start block).
  step: number;
  // Id of the block that was *executed* to produce this row.
  nodeId: string;
  // Role of that block (used to style the badge in the "Bloco" column).
  role: Role;
  // Snapshot of memory *after* the block ran (null value === "unknown").
  memory: Record<string, { type: DataType; value: any }>;
  // Text written to the output at this step, if any.
  output: string | null;
  // Text read from the input at this step, if any.
  input: string | null;
}

/**
 * Builds the desk-check ("teste de mesa") table from the sequence of machine
 * states produced during execution.
 *
 * `states` must be the full timeline, i.e. `[...stateHistory, machineState]`.
 *
 * Each *transition* states[k] -> states[k + 1] becomes one row: the block that
 * ran is `states[k].curNodeId` (a null curNodeId means the Start block), and
 * the values shown are the memory *after* that block executed
 * (`states[k + 1].memory`). This is the pedagogical convention: "run this
 * instruction, here is the resulting state".
 */
export default function buildTraceTable(
  flowchart: Flowchart,
  states: MachineState[],
): TraceRow[] {
  const rows: TraceRow[] = [];

  for (let k = 0; k < states.length - 1; k++) {
    const before = states[k];
    const after = states[k + 1];

    const node =
      before.curNodeId === null
        ? _.find(flowchart.nodes, { data: { role: Role.Start } })
        : _.find(flowchart.nodes, { id: before.curNodeId });
    if (node === undefined) continue;

    // Interaction atoms appended during this transition (input read / output
    // written by this block).
    const fresh = after.interaction.slice(before.interaction.length);
    const output =
      fresh
        .filter((a) => a.direction === "out")
        .map((a) => a.text)
        .join(" ") || null;
    const input =
      fresh
        .filter((a) => a.direction === "in")
        .map((a) => a.text)
        .join(" ") || null;

    rows.push({
      step: rows.length,
      nodeId: node.id,
      role: node.data.role,
      memory: after.memory,
      output,
      input,
    });
  }

  // The End block is *reached* but never *executed* (the machine halts on
  // arrival), so it produces no transition. Append it explicitly as the final
  // row when execution has halted, mirroring a hand-written desk check.
  const last = _.last(states);
  if (
    last !== undefined &&
    last.status === "halted" &&
    last.curNodeId !== null
  ) {
    const endNode = _.find(flowchart.nodes, { id: last.curNodeId });
    if (endNode !== undefined && endNode.data.role === Role.End) {
      rows.push({
        step: rows.length,
        nodeId: endNode.id,
        role: Role.End,
        memory: last.memory,
        output: null,
        input: null,
      });
    }
  }

  return rows;
}

// Renders the desk-check as Markdown (input/output summary + the table), handy
// for pasting into reports or documentation.
export function traceToMarkdown(
  flowchart: Flowchart,
  states: MachineState[],
  getString: (key: string) => string,
): string {
  const rows = buildTraceTable(flowchart, states);
  const interaction = _.last(states)?.interaction ?? [];
  const inputs = interaction
    .filter((atom) => atom.direction === "in")
    .map((atom) => atom.text);
  const outputs = interaction
    .filter((atom) => atom.direction === "out")
    .map((atom) => atom.text);

  const blockLabel = (row: TraceRow): string =>
    row.role === Role.Start || row.role === Role.End
      ? getString(`BlockLabel_${row.role}`)
      : row.nodeId;

  const header = ["#", "Bloco", ..._.map(flowchart.variables, "id")];
  const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
  const body = _.map(rows, (row) =>
    line([
      String(row.step),
      blockLabel(row),
      ..._.map(flowchart.variables, ({ id }) => {
        const value = row.memory[id]?.value ?? null;
        return value === null ? "?" : JSON.stringify(value);
      }),
    ]),
  );

  return [
    `${getString("TraceTable_Input")}: ${inputs.join(" ")}`,
    `${getString("TraceTable_Output")}: ${outputs.join(" ")}`,
    "",
    line(header),
    line(header.map(() => "---")),
    ...body,
  ].join("\n");
}
