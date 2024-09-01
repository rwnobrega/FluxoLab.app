import React from "react";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";

import Markdown from "~/components/General/Markdown";
import useStoreStrings from "~/store/useStoreStrings";

import Logo from "/FluxoLab.svg";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { getString } = useStoreStrings();

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Image src={Logo} alt="Logo" width="32" height="32" className="me-3" />
        <Modal.Title>{getString("ModalAbout_Title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <Markdown source={getString("ModalAbout_Body1")} />
        </p>
        <p>
          <Markdown
            source={getString("ModalAbout_Body2", {
              GitHub: "[GitHub](https://github.com/rwnobrega/FluxoLab.app)",
              GPL3: "[GPL3](https://www.gnu.org/licenses/gpl-3.0.en.html)",
            })}
          />
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          {getString("Button_Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
