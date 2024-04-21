import React from "react";
import Button from "react-bootstrap/Button";

import Tooltip from "~/components/General/Tooltip";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";

import { Props } from ".";

export default function ({ id, disabled }: Props): JSX.Element {
  const { getString } = useStoreStrings();

  const { removeVariable } = useStoreMachine();
  if (disabled) return <></>;
  return (
    <Tooltip text={getString("VariableList_Remove")}>
      <Button variant="danger" size="sm" onClick={() => removeVariable(id)}>
        <i className="bi bi-trash-fill" />
      </Button>
    </Tooltip>
  );
}
