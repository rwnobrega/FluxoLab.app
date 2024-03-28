import _ from "lodash";

import React from "react";

import Form from "react-bootstrap/Form";

import { Props } from ".";

import { variableTypes, Variable } from "machine/variables";

import useStoreMachine from "stores/useStoreMachine";
import useStoreStrings from "stores/useStoreStrings";

export default function ({ id, disabled }: Props): JSX.Element {
  const { getVariable, changeVariableType } = useStoreMachine();
  const { getString } = useStoreStrings();

  const variable = getVariable(id);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    changeVariableType(id, event.target.value as Variable["type"]);
  };

  return (
    <Form.Select
      size="sm"
      value={variable?.type}
      onChange={onChange}
      style={{ minWidth: "7.5em" }}
      disabled={disabled}
    >
      {_.map(variableTypes, ({ typeName }) => (
        <option key={typeName} value={typeName}>
          {getString(`VariableType_${typeName}`)}
        </option>
      ))}
    </Form.Select>
  );
}
