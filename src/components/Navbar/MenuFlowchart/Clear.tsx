import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useReactFlow } from "reactflow";

import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { clearFlowchart } = useStoreFlowchart();
  const { triggerToast } = useStoreEphemeral();
  const { getString } = useStoreStrings();

  const { setViewport } = useReactFlow();

  const onCancel = () => {
    setShowModal(false);
  };

  const onConfirmClear = () => {
    clearFlowchart();
    setViewport({ x: 0, y: 0, zoom: 1 });
    setShowModal(false);
    triggerToast({
      background: "success",
      icon: "bi-recycle",
      message: getString("ToastMessage_FlowchartCleared"),
    });
  };

  return (
    <Modal show={showModal} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{getString("ModalClear_Title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{getString("ModalClear_Body")}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {getString("Button_Cancel")}
        </Button>
        <Button variant="primary" onClick={onConfirmClear}>
          {getString("Button_Clear")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
