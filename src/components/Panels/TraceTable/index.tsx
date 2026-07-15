import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";

import buildTraceTable from "~/core/traceTable";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";
import palette from "~/utils/palette";

import TraceTableView from "./TraceTableView";

export default function (): JSX.Element {
  const { flowchart } = useStoreFlowchart();
  const { stateHistory, machineState, executeAction } = useStoreMachine();
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
  const prevLen = (stateHistory[stateHistory.length - 1]?.interaction ?? [])
    .length;
  const io = machineState.interaction.map((atom, index) => ({
    ...atom,
    current: index >= prevLen,
  }));
  const inputs = io.filter((atom) => atom.direction === "in");
  const outputs = io.filter((atom) => atom.direction === "out");

  return (
    <div className="d-flex flex-column h-100">
      {rows.length > 0 && (
        <div className="mb-2">
          <div className="d-flex align-items-center mb-1">
            <span style={{ minWidth: "5em" }}>
              {getString("TraceTable_Input")}:
            </span>
            <span className="flex-fill d-flex flex-wrap gap-2 px-2 py-1 rounded bg-primary bg-opacity-10 small font-monospace">
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
            <span style={{ minWidth: "5em" }}>
              {getString("TraceTable_Output")}:
            </span>
            <span className="flex-fill d-flex flex-wrap gap-2 px-2 py-1 rounded bg-success bg-opacity-10 small font-monospace">
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
