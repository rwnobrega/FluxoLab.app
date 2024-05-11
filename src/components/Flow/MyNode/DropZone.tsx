import React, { useState } from "react";
import { Handle, Position } from "reactflow";

import useStoreEphemeral from "~/store/useStoreEphemeral";

interface Props {
  nodeId: string;
  position: Position;
}

export default function ({ nodeId, position }: Props): JSX.Element {
  const [mouseHover, setMouseHover] = useState<boolean>(false);

  const { connectionSource, isEditingHandles } = useStoreEphemeral();

  const isVisible = isEditingHandles && connectionSource === nodeId;

  return (
    <Handle
      id={position}
      type="target"
      position={position}
      isConnectableStart={false}
      style={{
        display: "flex",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        border: 0,
        backgroundColor: isVisible ? "rgba(0, 0, 0, 0.3)" : "transparent",
      }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    />
  );
}
