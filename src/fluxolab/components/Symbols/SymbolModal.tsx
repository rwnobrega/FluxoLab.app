import React, { useCallback, useEffect, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import TextInput from "components/General/TextInput";

import grammar from "language/grammar";
import { getExpectedText } from "language/errors";

import useStoreFlow from "stores/useStoreFlow";
import useStoreStrings from "stores/useStoreStrings";

interface Props {
  title: string;
  prefixLabel?: string;
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
  prefixCommand: prefix = "",
  placeholder,
  nodeId,
  value,
  showModal,
  setShowModal,
}: Props): JSX.Element {
  const [textValue, setTextValue] = useState<string>(value);
  const [problem, setProblem] = useState<string | null>(null);

  const { updateNodeProp } = useStoreFlow();
  const { language, getString } = useStoreStrings();

  useEffect(() => {
    setTextValue(value);
  }, [showModal]);

  useEffect(() => {
    const matchResult = grammar.match(`${prefix}${textValue}`, matchStartRule);
    if (matchResult.failed()) {
      const posNumber = matchResult.getInterval().startIdx - prefix.length;
      const problem = getString("SyntaxError", {
        pos: String(posNumber),
        expected: getExpectedText(matchResult),
      });
      setProblem(problem);
    } else {
      setProblem(null);
    }
  }, [textValue, language]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setTimeout(() => {
        updateNodeProp(nodeId, "data", textValue);
      }, 200);
      setShowModal(false);
    },
    [nodeId, textValue, updateNodeProp, setShowModal],
  );

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row}>
            {prefixLabel !== undefined && (
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
