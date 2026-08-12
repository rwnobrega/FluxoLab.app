import _ from "lodash";
import React, { useEffect, useRef } from "react";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";

import NodeNumberBadge from "~/components/NodeNumberBadge";
import { displayValue } from "~/core/dataTypes";
import { TraceRow } from "~/core/traceTable";
import { Flowchart } from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";
import palette from "~/utils/palette";

// Variable values are shown in dark gray. Input/output are summarized above the
// table (in the tab), so the table has no output column.
const VALUE_COLOR = palette.gray600;

// Shrink the "#" and "Bloco" columns to their content, letting the variable
// columns take the remaining width.
const NARROW_COL: React.CSSProperties = { width: "1%", whiteSpace: "nowrap" };

// A variable column shares the leftover width evenly and never grows to fit its
// contents: `maxWidth: 0` is what lets an arbitrarily long integer be elided
// instead of stretching the table (the whole value is on the cell's tooltip).
const VALUE_COL: React.CSSProperties = { maxWidth: 0 };

// The header names each variable the way the Variables panel does, where the
// name sits on a small `secondary` button. Here it is a label and not a control,
// so it goes on a `span`, and `pointer-events: none` drops what would otherwise
// be left of the button behavior: the hover background and the hand cursor.
// (`.btn` already sets `user-select: none`, so nothing is lost by it.)
const VARIABLE_CHIP_CLASS = "btn btn-secondary btn-sm font-monospace";
const VARIABLE_CHIP: React.CSSProperties = { pointerEvents: "none" };

interface Props {
  variables: Flowchart["variables"];
  // Block number of each node, as shown on the boxes in the flowchart. Passed
  // in rather than computed here so that both views number from one source.
  nodeNumbers: Map<string, number>;
  rows: TraceRow[];
}

export default function ({ variables, nodeNumbers, rows }: Props): JSX.Element {
  const { getString } = useStoreStrings();

  // Keep the current (last) row in view as execution advances or steps back.
  const currentRowRef = useRef<HTMLTableRowElement>(null);
  const lastStep = rows.length > 0 ? rows[rows.length - 1].step : -1;
  useEffect(() => {
    currentRowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [rows.length, lastStep]);

  if (rows.length === 0) {
    return (
      <Alert variant="secondary" className="mb-0">
        <i className="bi bi-info-circle me-2" />
        {getString("TraceTable_Empty")}
      </Alert>
    );
  }

  // No own scroll container: the parent owns the scroll region so the sticky
  // header pins correctly and the table fills the available height.
  return (
    <Table size="sm" hover className="mb-0 align-middle text-center">
      <thead
        className="table-light"
        style={{ position: "sticky", top: 0, zIndex: 1 }}
      >
        <tr>
          <th style={NARROW_COL}>{getString("TraceTable_Step")}</th>
          <th style={NARROW_COL}>{getString("TraceTable_Block")}</th>
          {_.map(variables, ({ id }) => (
            <th key={id}>
              <span className={VARIABLE_CHIP_CLASS} style={VARIABLE_CHIP}>
                {id}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {_.map(rows, (row, index) => {
          const isCurrent = index === rows.length - 1;
          return (
            <tr
              key={index}
              ref={isCurrent ? currentRowRef : undefined}
              className={isCurrent ? "table-primary" : ""}
            >
              <td style={NARROW_COL}>{row.step}</td>
              <td style={NARROW_COL}>
                <NodeNumberBadge number={nodeNumbers.get(row.nodeId) ?? 0} />
              </td>
              {_.map(variables, ({ id }) => {
                const text = displayValue(row.memory[id]?.value ?? null);
                return (
                  <td
                    key={id}
                    className="font-monospace fw-bold"
                    style={{ color: VALUE_COLOR, ...VALUE_COL }}
                  >
                    <span className="d-block text-truncate" title={text}>
                      <small>{text}</small>
                    </span>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
