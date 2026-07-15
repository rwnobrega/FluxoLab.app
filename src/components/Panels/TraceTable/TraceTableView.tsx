import _ from "lodash";
import React, { useEffect, useRef } from "react";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";

import { Role, getRoleBoxStyle } from "~/core/roles";
import { TraceRow } from "~/core/traceTable";
import { Flowchart } from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";
import palette from "~/utils/palette";

// Variable values are shown in dark gray. Input/output are summarized above the
// table (in the tab), so the table has no output column.
const VALUE_COLOR = palette.gray800;

// Shrink the "#" and "Bloco" columns to their content, letting the variable
// columns take the remaining width.
const NARROW_COL: React.CSSProperties = { width: "1%", whiteSpace: "nowrap" };

interface Props {
  variables: Flowchart["variables"];
  rows: TraceRow[];
}

function formatValue(value: any): string {
  // Matches the rendering used in the Variables panel: unknown -> "?".
  return value === null ? "?" : JSON.stringify(value);
}

// "Bloco" cell: Start/End show their label, other blocks show their id inside
// a small box tinted by role, mirroring the flowchart's block colors.
function BlockBadge({ nodeId, role }: { nodeId: string; role: Role }) {
  const { getString } = useStoreStrings();

  if (role === Role.Start || role === Role.End) {
    return (
      <span className="fw-semibold">{getString(`BlockLabel_${role}`)}</span>
    );
  }

  // A rounded box tinted by the block's role color. We intentionally skip the
  // role clipPath (parallelogram / diamond) used in the flowchart: at badge
  // size it would clip the id. The color alone conveys the block type.
  const boxStyle = getRoleBoxStyle(role);
  return (
    <span
      className="d-inline-flex justify-content-center align-items-center small fw-bold"
      style={{
        minWidth: "28px",
        height: "28px",
        padding: "0 8px",
        color: boxStyle.textColor,
        background: boxStyle.backgroundColor,
        borderRadius: "6px",
      }}
    >
      {nodeId}
    </span>
  );
}

export default function ({ variables, rows }: Props): JSX.Element {
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
            <th key={id} className="font-monospace fst-italic">
              {id}
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
                <BlockBadge nodeId={row.nodeId} role={row.role} />
              </td>
              {_.map(variables, ({ id }) => (
                <td
                  key={id}
                  className="font-monospace fw-bold"
                  style={{ color: VALUE_COLOR }}
                >
                  {formatValue(row.memory[id]?.value ?? null)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
