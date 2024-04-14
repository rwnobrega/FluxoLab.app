import _ from "lodash";

import React, { useCallback } from "react";

import { useReactFlow } from "reactflow";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Markdown from "components/General/Markdown";

import useStoreFlow from "stores/useStoreFlow";
import useStoreMachine from "stores/useStoreMachine";
import useStoreEphemeral from "stores/useStoreEphemeral";
import useStoreStrings from "stores/useStoreStrings";

import examples from "examples";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { clearAll, setNodes, makeConnections } = useStoreFlow();
  const { setVariables, setTitle } = useStoreMachine();
  const { triggerToast } = useStoreEphemeral();
  const { getString } = useStoreStrings();

  const { setViewport } = useReactFlow();

  const openExample = useCallback(
    (index: number) => {
      const { variables, nodes, edges, title } = examples[index];

      clearAll();
      setViewport({ x: 0, y: 0, zoom: 1 });
      setNodes(nodes);
      makeConnections(edges);
      setVariables(variables);
      setTitle(title);

      triggerToast({
        message: getString("ToastMessage_ExampleLoaded"),
        icon: "bi-check-circle",
        background: "success",
      });

      setShowModal(false);
    },
    [
      clearAll,
      setViewport,
      setNodes,
      makeConnections,
      setVariables,
      setTitle,
      triggerToast,
      getString,
      setShowModal,
    ],
  );

  return (
    <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{getString("ModalExamples_Title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <Markdown source={getString("ModalExamples_Body")} />
        </p>
        <div className="px-3">
          {_.map(examples, ({ title, description }, index) => (
            <p key={index}>
              <b
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => openExample(index)}
              >
                {title}
              </b>
              {" – "}
              <i>{description}</i>
            </p>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          {getString("Button_Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
