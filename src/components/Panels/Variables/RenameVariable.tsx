import _ from "lodash";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import TextInput from "~/components/General/TextInput";
import { getExpectedText } from "~/core/language/errors";
import grammar from "~/core/language/grammar";
import semantics from "~/core/language/semantics";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  id: string;
  showModal: boolean;
  setShowModal: (modal: boolean) => void;
}

export default function ({ id, showModal, setShowModal }: Props): JSX.Element {
  const [textId, setTextId] = useState<string>(id);
  const [problem, setProblem] = useState<string>("");

  const { flowchart, renameVariable } = useStoreFlowchart();
  const { getString } = useStoreStrings();

  useEffect(() => {
    setTextId(id);
  }, [showModal]);

  useEffect(() => {
    const prefixCommand = "let ";
    const matchResult = grammar.match(
      `${prefixCommand}${textId}`,
      "Command_declaration",
    );
    if (matchResult.failed()) {
      const problem = getString("SyntaxError", {
        pos: matchResult.getInterval().startIdx - prefixCommand.length,
        expected: getExpectedText(matchResult),
      });
      setProblem(problem);
    } else {
      const otherVariables = _.reject(flowchart.variables, { id });
      const error = semantics(matchResult).check(otherVariables);
      if (error !== null) {
        setProblem(getString(error.message, error.payload));
      } else {
        setProblem("");
      }
    }
  }, [textId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTimeout(() => {
      renameVariable(id, textId.trim());
    }, 200);
    setShowModal(false);
  };

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
