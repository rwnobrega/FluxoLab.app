import React, { useMemo } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import flowchartToPseudocode from "~/core/pseudocode";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

import PseudocodeView from "./PseudocodeView";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { flowchart } = useStoreFlowchart();
  const { triggerToast } = useStoreEphemeral();
  const { getString } = useStoreStrings();

  // `useStoreFlowchart` actions update the flowchart in place, keeping the
  // same object identity, so `flowchart` alone is not a reliable dependency
  // (cf. the serialized dependencies in Updater.tsx).  Recomputing when the
  // modal opens suffices: while it is open, the backdrop blocks editing, and
  // undo/redo (the only remaining mutations) do replace the identity.
  const result = useMemo(
    () => flowchartToPseudocode(flowchart),
    [flowchart, showModal],
  );

  const handleCopy = () => {
    if (!result.ok) return;
    void navigator.clipboard.writeText(result.pseudocode);
    triggerToast({
      message: getString("ToastMessage_CopyPseudocode"),
      icon: "bi-clipboard-check",
      background: "secondary",
    });
  };

  function renderBody(): JSX.Element {
    if (result.ok) {
      return <PseudocodeView code={result.pseudocode} />;
    }
    if (result.reason === "unstructured") {
      return (
        <Alert variant="warning" className="mb-0">
          <i className="bi bi-shuffle me-2" />
          {getString("StructuredBadge_TooltipNo")}
        </Alert>
      );
    }
    return (
      <Alert variant="danger" className="mb-0">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        {getString("ModalPseudocode_Invalid")}
      </Alert>
    );
  }

  return (
    <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{getString("ModalPseudocode_Title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{renderBody()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          {getString("Button_Close")}
        </Button>
        {result.ok && (
          <Button variant="primary" onClick={handleCopy}>
            {getString("Button_Copy")}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
