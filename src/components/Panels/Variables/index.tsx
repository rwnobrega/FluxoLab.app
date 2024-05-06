import _ from "lodash";
import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";

import VariableItem from "./Item";

export default function (): JSX.Element {
  const { addVariable } = useStoreFlowchart();
  const { machineState } = useStoreMachine();
  const { getString } = useStoreStrings();

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex flex-row justify-content-between align-items-center mb-2 gap-3">
        <span className="fw-semibold">{getString("VariableList_Title")}</span>
        <Button
          size="sm"
          className="fw-semibold text-nowrap"
          onClick={addVariable}
        >
          {getString("VariableList_Add")}
        </Button>
      </div>
      <div style={{ overflowY: "auto", overflowX: "clip" }}>
        <Table size="sm" variant="borderless" className="mb-0">
          <tbody>
            {_.map(machineState.memory, ({ type, value }, id) => (
              <VariableItem key={id} id={id} type={type} value={value} />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
