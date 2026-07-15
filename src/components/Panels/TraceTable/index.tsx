import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Role } from "~/core/roles";
import buildTraceTable, { TraceRow } from "~/core/traceTable";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart, { Flowchart } from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";
import palette from "~/utils/palette";

import TraceTableView from "./TraceTableView";

// Renders the desk-check table as Markdown, prefixed with the input/output
// summary, handy for pasting into reports or documentation.
function toMarkdown(
  variables: Flowchart["variables"],
  rows: TraceRow[],
  blockOf: (row: TraceRow) => string,
  inputLabel: string,
  outputLabel: string,
  inputs: string[],
  outputs: string[],
): string {
  const header = ["#", "Bloco", ..._.map(variables, "id")];
  const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
  const body = _.map(rows, (row) =>
    line([
      String(row.step),
      blockOf(row),
      ..._.map(variables, ({ id }) => {
        const value = row.memory[id]?.value ?? null;
        return value === null ? "?" : JSON.stringify(value);
      }),
    ]),
  );
  return [
    `${inputLabel}: ${inputs.join(" ")}`,
    `${outputLabel}: ${outputs.join(" ")}`,
    "",
    line(header),
    line(header.map(() => "---")),
    ...body,
  ].join("\n");
}

export default function (): JSX.Element {
  const { flowchart } = useStoreFlowchart();
  const { stateHistory, machineState, executeAction } = useStoreMachine();
  const { triggerToast } = useStoreEphemeral();
  const { getString } = useStoreStrings();

  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isWaiting = machineState.status === "waiting";

  // Focus the entry field as soon as the machine blocks on a read, so input can
  // be given without leaving the desk-check tab.
  useEffect(() => {
    if (isWaiting) inputRef.current?.focus();
  }, [isWaiting]);

  const handleSendInput = () => {
    const trimmed = inputText.trim();
    if (trimmed.length > 0) {
      machineState.input = trimmed;
      executeAction("nextStep");
      setInputText("");
    }
  };

  const rows = buildTraceTable(flowchart, [...stateHistory, machineState]);

  // Input/output summary. Atoms appended in the last transition (index beyond
  // the previous state's interaction) belong to the current step and are bold.
  const prevLen = (_.last(stateHistory)?.interaction ?? []).length;
  const io = machineState.interaction.map((atom, index) => ({
    ...atom,
    current: index >= prevLen,
  }));
  const inputs = io.filter((atom) => atom.direction === "in");
  const outputs = io.filter((atom) => atom.direction === "out");

  const blockOf = (row: TraceRow): string =>
    row.role === Role.Start || row.role === Role.End
      ? getString(`BlockLabel_${row.role}`)
      : row.nodeId;

  const handleCopy = () => {
    const markdown = toMarkdown(
      flowchart.variables,
      rows,
      blockOf,
      getString("TraceTable_Input"),
      getString("TraceTable_Output"),
      inputs.map((atom) => atom.text),
      outputs.map((atom) => atom.text),
    );
    void navigator.clipboard.writeText(markdown);
    triggerToast({
      message: getString("ToastMessage_CopyTraceTable"),
      icon: "bi-clipboard-check",
      background: "secondary",
    });
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex flex-row justify-content-between align-items-center mb-2 gap-3">
        <span className="fw-semibold">{getString("TraceTable_Title")}</span>
        <Button
          size="sm"
          variant="secondary"
          className="fw-semibold text-nowrap"
          disabled={rows.length === 0}
          onClick={handleCopy}
        >
          <i className="bi bi-clipboard me-1" />
          {getString("Button_Copy")}
        </Button>
      </div>
      {rows.length > 0 && (
        <div className="mb-2 small font-monospace">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-semibold" style={{ minWidth: "5em" }}>
              {getString("TraceTable_Input")}:
            </span>
            <span className="flex-fill d-flex flex-wrap gap-2 px-2 py-1 rounded bg-primary bg-opacity-10">
              {inputs.length > 0
                ? inputs.map((atom, index) => (
                    <span
                      key={index}
                      className={atom.current ? "fw-bold" : ""}
                      style={{ color: palette.blue }}
                    >
                      {atom.text}
                    </span>
                  ))
                : "\u00A0"}
            </span>
          </div>
          <div className="d-flex align-items-center">
            <span className="fw-semibold" style={{ minWidth: "5em" }}>
              {getString("TraceTable_Output")}:
            </span>
            <span className="flex-fill d-flex flex-wrap gap-2 px-2 py-1 rounded bg-success bg-opacity-10">
              {outputs.length > 0
                ? outputs.map((atom, index) => (
                    <span
                      key={index}
                      className={atom.current ? "fw-bold" : ""}
                      style={{ color: palette.green }}
                    >
                      {atom.text}
                    </span>
                  ))
                : "\u00A0"}
            </span>
          </div>
        </div>
      )}
      <div className="flex-fill" style={{ overflow: "auto", minHeight: 0 }}>
        <TraceTableView variables={flowchart.variables} rows={rows} />
      </div>
      {isWaiting && (
        <Form.Control
          ref={inputRef}
          autoFocus
          size="sm"
          value={inputText}
          className="mt-2"
          onChange={(event) => setInputText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSendInput();
          }}
        />
      )}
    </div>
  );
}
