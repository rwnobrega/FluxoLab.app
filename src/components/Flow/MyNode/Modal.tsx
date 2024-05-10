import _ from "lodash";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { Node, Position, useUpdateNodeInternals } from "reactflow";

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

type HandlePositions = NodeData["handlePositions"];

export default function ({
  node,
  showModal,
  setShowModal,
}: Props): JSX.Element {
  const [textValue, setTextValue] = useState<string>("");
  const [handlePositions, setHandlePositions] = useState<HandlePositions>({});
  const [problem, setProblem] = useState<string>("");

  const { changeNodePayload, changeNodeHandlePositions } = useStoreFlowchart();
  const { language, getString } = useStoreStrings();

  const updateNodeInternals = useUpdateNodeInternals();

  const { prefix, handles } = getBlockType(node.type as BlockTypeId);

  useEffect(() => {
    if (showModal) {
      setTextValue(node.data.payload);
      setHandlePositions(node.data.handlePositions);
    }
  }, [showModal]);

  useEffect(() => {
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
    changeNodePayload(node.id, textValue);
    changeNodeHandlePositions(node.id, handlePositions);
    updateNodeInternals(node.id);
    setShowModal(false);
  };

  const label = getString(`BlockLabel_${node.type}`);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{getString(`BlockTitle_${node.type}`)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {node.type !== "start" && (
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
          )}
          {_.map(handles, ({ id }) => (
            <Form.Group as={Row} key={id}>
              <Form.Label column className="fst-italic m-1" sm="2">
                {id}
              </Form.Label>
              <Col className="m-1" sm="9">
                <Form.Select
                  value={handlePositions[id]}
                  onChange={(event) =>
                    setHandlePositions({
                      ...handlePositions,
                      [id]: event.target.value as Position,
                    })
                  }
                >
                  {_.map(Position, (position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
          ))}
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
