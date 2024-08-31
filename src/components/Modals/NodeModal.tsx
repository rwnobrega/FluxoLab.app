import _ from "lodash";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import TextInput from "~/components/General/TextInput";
import { getExpectedText } from "~/core/language/errors";
import grammar from "~/core/language/grammar";
import { Role } from "~/core/roles";
import useStoreFlowchart, { NodeData } from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  id: string;
  data: NodeData;
  showModal: boolean;
  setShowModal: (modal: boolean) => void;
}

export default function ({
  id,
  data,
  showModal,
  setShowModal,
}: Props): JSX.Element {
  const [textValue, setTextValue] = useState<string>("");
  const [problem, setProblem] = useState<string>("");

  const { changeNodePayload } = useStoreFlowchart();
  const { language, getString } = useStoreStrings();

  useEffect(() => {
    if (showModal) {
      setTextValue(data.payload);
    }
  }, [showModal]);

  useEffect(() => {
    const prefix = data.role;
    const matchResult = grammar.match(`${prefix} ${textValue}`, "Command");
    if (matchResult.failed()) {
      const problem = getString("SyntaxError", {
        pos: matchResult.getInterval().startIdx - prefix.length - 1,
        expected: getExpectedText(matchResult),
      });
      setProblem(problem);
    } else {
      setProblem("");
    }
  }, [textValue, language]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeNodePayload(id, textValue.trim());
    setShowModal(false);
  };

  const label = getString(`BlockLabel_${data.role}`);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{getString(`BlockTitle_${data.role}`)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {data.role !== Role.Start && (
            <Form.Group as={Row}>
              {label !== "" && (
                <Form.Label column className="fw-bold fst-italic" md="auto">
                  {label}
                </Form.Label>
              )}
              <Col>
                <TextInput
                  helpText={getString(`BlockHelpText_${data.role}`)}
                  value={textValue}
                  setValue={setTextValue}
                  problem={problem}
                />
              </Col>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {getString("Button_Cancel")}
          </Button>
          <Button variant="primary" type="submit">
            {getString("Button_Save")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
