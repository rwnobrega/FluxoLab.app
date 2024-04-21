import React, { useState } from "react";
import Button from "react-bootstrap/Button";

import { Props } from ".";
import VariableModalRename from "../RenameVariable";

export default function ({ id, disabled }: Props): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="font-monospace"
        style={{ cursor: disabled ? "default" : "pointer" }}
        onClick={() => !disabled && setShowModal(true)}
      >
        {id}
      </Button>
      <VariableModalRename
        id={id}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}
