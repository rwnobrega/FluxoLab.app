import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import TextInput from "~/components/General/TextInput";
import { getExpectedText } from "~/core/language/errors";
import grammar from "~/core/language/grammar";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  title: string;
  prefixLabel: string;
  prefixCommand?: string;
  matchStartRule: string;
  placeholder: string;
  nodeId: string;
  value: string;
  showModal: boolean;
  setShowModal: (modal: boolean) => void;
}

export default function ({
  title,
  prefixLabel,
  matchStartRule,
  prefixCommand = "",
  placeholder,
  nodeId,
  value,
  showModal,
  setShowModal,
}: Props): JSX.Element {
  const [textValue, setTextValue] = useState<string>(value);
  const [problem, setProblem] = useState<string>("");

  const { changeNodeData } = useStoreFlowchart();
  const { language, getString } = useStoreStrings();

  useEffect(() => {
    setTextValue(value);
  }, [showModal]);

  useEffect(() => {
    const matchResult = grammar.match(
      `${prefixCommand}${textValue}`,
      matchStartRule,
    );
    if (matchResult.failed()) {
      const posNumber =
        matchResult.getInterval().startIdx - prefixCommand.length;
      const problem = getString("SyntaxError", {
        pos: String(posNumber),
        expected: getExpectedText(matchResult),
      });
      setProblem(problem);
    } else {
      setProblem("");
    }
  }, [textValue, language]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTimeout(() => {
      changeNodeData(nodeId, textValue);
    }, 200);
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row}>
            {prefixLabel !== "" && (
              <Form.Label column className="fw-bold fst-italic" md="auto">
                {prefixLabel}
              </Form.Label>
            )}
            <Col>
              <TextInput
                placeholder={placeholder}
                value={textValue}
                setValue={setTextValue}
                problem={problem}
              />
            </Col>
          </Form.Group>
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
