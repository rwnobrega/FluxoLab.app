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
  const { importSimpleFlowchart, setSavedViewport } = useStoreFlowchart();
  const { triggerToast } = useStoreEphemeral();
  const { getString } = useStoreStrings();

  const { fitView, getViewport } = useReactFlow();

  const openExample = (index: number) => {
    const { variables, nodes, edges, title: id } = examples[index];
    const title = getString(`ExampleTitle_${id}`);

    importSimpleFlowchart({ title, variables, nodes, edges });
    setTimeout(() => {
      fitView({ minZoom: 1, maxZoom: 1 });
      setSavedViewport(getViewport());
    }, 100);

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
          {_.map(examples, ({ title: id }, index) => (
            <p key={index}>
              <b
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => openExample(index)}
              >
                {getString(`ExampleTitle_${id}`)}
              </b>
              {" – "}
              <i>{getString(`ExampleDescription_${id}`)}</i>
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
