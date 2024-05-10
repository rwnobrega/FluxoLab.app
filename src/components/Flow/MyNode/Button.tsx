import React from "react";
import Button from "react-bootstrap/Button";

interface Props {
  variant: string;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  icon: string;
  visible: boolean;
  onClick: () => void;
}

export default function ({
  variant,
  top,
  right,
  bottom,
  left,
  icon,
  visible,
  onClick,
}: Props): JSX.Element {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={visible ? onClick : undefined}
      style={{
        position: "absolute",
        top: top,
        right: right,
        bottom: bottom,
        left: left,
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
      <i className={`bi ${icon}`} />
    </Button>
  );
}
