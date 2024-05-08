import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { Node } from "reactflow";

import TextInput from "~/components/General/TextInput";
import { BlockTypeId, getBlockType } from "~/core/blockTypes";
import { getExpectedText } from "~/core/language/errors";
import grammar from "~/core/language/grammar";
import useStoreFlowchart, { NodeData } from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  node: Node<NodeData>;
  showModal: boolean;
  setShowModal: (modal: boolean) => void;
}

export default function ({
  node,
  showModal,
  setShowModal,
}: Props): JSX.Element {
  const [textValue, setTextValue] = useState<string>("");
  const [problem, setProblem] = useState<string>("");

  const { changeNodePayload } = useStoreFlowchart();
  const { language, getString } = useStoreStrings();

  const blockType = getBlockType(node.type as BlockTypeId);
  const { prefixCommand } = blockType;

  useEffect(() => {
    if (showModal) {
      setTextValue(node.data.payload);
    }
  }, [showModal]);

  useEffect(() => {
    const matchResult = grammar.match(
      `${prefixCommand}${textValue}`,
      `Command_${node.type}`,
    );
    if (matchResult.failed()) {
      const problem = getString("SyntaxError", {
        pos: matchResult.getInterval().startIdx - prefixCommand.length,
        expected: getExpectedText(matchResult),
      });
      setProblem(problem);
    } else {
      setProblem("");
    }
  }, [textValue, language]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeNodePayload(node.id, textValue);
    setShowModal(false);
  };

  const label = getString(`BlockLabel_${node.type}`);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{getString(`BlockTitle_${node.type}`)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row}>
            {label !== "" && (
              <Form.Label column className="fw-bold fst-italic" md="auto">
                {label}
              </Form.Label>
            )}
            <Col>
              <TextInput
                placeholder={getString(`BlockPlaceholder_${node.type}`)}
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
