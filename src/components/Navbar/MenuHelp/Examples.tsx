import _ from "lodash";
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useReactFlow } from "reactflow";

import Markdown from "~/components/General/Markdown";
import examples from "~/core/examples";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { importSimpleFlowchart } = useStoreFlowchart();
  const { triggerToast } = useStoreEphemeral();
  const { getString } = useStoreStrings();

  const { setViewport } = useReactFlow();

  const openExample = (index: number) => {
    const { variables, nodes, edges, title } = examples[index];

    importSimpleFlowchart({ title, variables, nodes, edges });
    setViewport({ x: 0, y: 0, zoom: 1 });

    triggerToast({
      message: getString("ToastMessage_ExampleLoaded"),
      icon: "bi-check-circle",
      background: "success",
    });

    setShowModal(false);
  };

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
