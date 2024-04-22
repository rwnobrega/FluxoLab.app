import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useReactFlow } from "reactflow";

import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlow from "~/store/useStoreFlow";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { clearAll } = useStoreFlow();
  const { triggerToast } = useStoreEphemeral();
  const { clearMachine } = useStoreMachine();
  const { getString } = useStoreStrings();

  const { setViewport } = useReactFlow();

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    clearAll();
    setViewport({ x: 0, y: 0, zoom: 1 });
    clearMachine();
    setShowModal(false);
    triggerToast({
      background: "success",
      icon: "bi-recycle",
      message: getString("ToastMessage_FlowchartCleared"),
    });
  };

  return (
    <Modal show={showModal} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{getString("ModalClear_Title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{getString("ModalClear_Body")}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          {getString("Button_Cancel")}
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          {getString("Button_Clear")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
