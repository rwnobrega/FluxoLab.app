import React from "react";
import Button from "react-bootstrap/Button";

interface Props {
  onClick: () => void;
  visible: boolean;
}

export default function ({ onClick, visible }: Props): JSX.Element {
  return (
    <Button
      variant="danger"
      size="sm"
      onClick={onClick}
      style={{
        position: "absolute",
        top: "-8px",
        right: "-8px",
        width: "24px",
        height: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transition: "visibility 0s, opacity 0.2s linear",
      }}
    >
      <i className="bi bi-trash-fill" />
    </Button>
  );
}
