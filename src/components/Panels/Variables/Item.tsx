import _ from "lodash";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

import Tooltip from "~/components/General/Tooltip";
import VariableModal from "~/components/Modals/VariableModal";
import { DataType } from "~/core/dataTypes";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";

export interface Props {
  id: string;
}

export default function ({ id }: Props): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { changeVariableType, removeVariable } = useStoreFlowchart();
  const { machineState } = useStoreMachine();
  const { getString } = useStoreStrings();

  if (!_.has(machineState.memory, id)) return <></>;

  const { type, value } = machineState.memory[id];

  return (
    <>
      <VariableModal
        id={id}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <td>
        <Button
          variant="secondary"
          size="sm"
          className="font-monospace"
          onClick={() => setShowModal(true)}
        >
          {id}
        </Button>
      </td>
      <td>
        <Form.Select
          size="sm"
          value={type}
          onChange={(e) => changeVariableType(id, e.target.value as DataType)}
          className="w-auto"
        >
          {_.map(DataType, (id) => (
            <option key={id} value={id}>
              {getString(`DataType_${id}`)}
            </option>
          ))}
        </Form.Select>
      </td>
      <td className="w-100">
        <small className="d-flex p-1 fw-bold font-monospace text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-1">
          {value === null ? "?" : JSON.stringify(value)}
        </small>
      </td>
      <td>
        <Tooltip text={getString("VariableList_Remove")}>
          <Button variant="danger" size="sm" onClick={() => removeVariable(id)}>
            <i className="bi bi-trash-fill" />
          </Button>
        </Tooltip>
      </td>
    </>
  );
}
