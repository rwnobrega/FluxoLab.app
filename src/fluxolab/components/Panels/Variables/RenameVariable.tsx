import _ from "lodash";

import React, { useCallback, useEffect, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import TextInput from "components/General/TextInput";

import useStoreMachine from "stores/useStoreMachine";
import useStoreStrings from "stores/useStoreStrings";

import isValidIdentifier from "language/isValidIdentifier";

interface Props {
  id: string;
  showModal: boolean;
  setShowModal: (modal: boolean) => void;
}

export default function ({ id, showModal, setShowModal }: Props): JSX.Element {
  const [textId, setTextId] = useState<string>(id);
  const [problem, setProblem] = useState<string>("");

  const { machine, renameVariable } = useStoreMachine();
  const { getString } = useStoreStrings();

  useEffect(() => {
    setTextId(id);
  }, [showModal]);

  useEffect(() => {
    if (_.isEmpty(textId)) {
      setProblem(getString("IdentifierError_Empty"));
    } else if (!isValidIdentifier(textId)) {
      setProblem(getString("IdentifierError_Invalid"));
    } else if (
      textId !== id &&
      _.includes(_.map(machine.variables, "id"), textId)
    ) {
      setProblem(getString("IdentifierError_Duplicate"));
    } else {
      setProblem("");
    }
  }, [textId]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setTimeout(() => {
        renameVariable(id, textId);
      }, 200);
      setShowModal(false);
    },
    [id, textId, renameVariable, setShowModal],
  );

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{getString("ModalRenameVariable_Title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextInput
            placeholder={getString("ModalRenameVariable_Placeholder")}
            value={textId}
            setValue={setTextId}
            problem={getString(problem)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {getString("Button_Cancel")}
          </Button>
          <Button variant="primary" type="submit" disabled={problem !== ""}>
            {getString("Button_Rename")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
