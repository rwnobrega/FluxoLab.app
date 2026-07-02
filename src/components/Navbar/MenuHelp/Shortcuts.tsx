import _ from "lodash";
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

interface Shortcut {
  keys: string;
  description: string;
}

const executionShortcuts: Shortcut[] = [
  { keys: "F6", description: "PlayButton_Reset" },
  { keys: "F7", description: "PlayButton_StepBack" },
  { keys: "F8", description: "PlayButton_NextStep" },
];

const editingShortcuts: Shortcut[] = [
  { keys: "Ctrl+Z", description: "UndoRedo_Undo" },
  { keys: "Ctrl+Y", description: "UndoRedo_Redo" },
  { keys: "Ctrl+C", description: "ModalShortcuts_Copy" },
  { keys: "Ctrl+X", description: "ModalShortcuts_Cut" },
  { keys: "Ctrl+V", description: "ModalShortcuts_Paste" },
  { keys: "Delete", description: "ModalShortcuts_Delete" },
  { keys: "Ctrl+A", description: "ModalShortcuts_SelectAll" },
  { keys: "Esc", description: "ModalShortcuts_Deselect" },
  { keys: "Shift", description: "ModalShortcuts_MultiSelect" },
];

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { getString } = useStoreStrings();
  const classes = "font-monospace col-3";

  const renderTable = (shortcuts: Shortcut[]): JSX.Element => (
    <Table striped bordered hover>
      <tbody>
        {_.map(shortcuts, ({ keys, description }) => (
          <tr key={keys}>
            <td className={classes}>{keys}</td>
            <td>{getString(description)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{getString("ModalShortcuts_Title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflowY: "auto", maxHeight: "67vh" }}>
        <h5>{getString("ModalShortcuts_SubtitleExecution")}</h5>
        {renderTable(executionShortcuts)}
        <h5>{getString("ModalShortcuts_SubtitleEditing")}</h5>
        {renderTable(editingShortcuts)}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          {getString("Button_Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
