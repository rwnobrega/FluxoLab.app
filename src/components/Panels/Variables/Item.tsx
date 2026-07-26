import _ from "lodash";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

import Tooltip from "~/components/General/Tooltip";
import VariableModal from "~/components/Modals/VariableModal";
import { DataType, displayValue } from "~/core/dataTypes";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";
import palette from "~/utils/palette";

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
  const text = displayValue(value);

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
      {/* `maxWidth: 0` keeps a long value from widening the column: the cell
          takes whatever room is left and the text is elided into it. */}
      <td className="w-100" style={{ maxWidth: 0 }}>
        <small
          className="d-flex p-1 fw-bold font-monospace bg-body-secondary bg-opacity-50 border rounded-1"
          style={{ color: palette.gray600 }}
        >
          <span className="text-truncate" style={{ minWidth: 0 }} title={text}>
            {text}
          </span>
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
