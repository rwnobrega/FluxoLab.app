import _ from "lodash";
import React, { useState } from "react";
import { useReactFlow } from "reactflow";

import { Role, getRoleBoxStyle } from "~/core/roles";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";
import colors from "~/utils/colors";

interface Props {
  role: Role;
}

export default function ({ role }: Props): JSX.Element {
  const { getString } = useStoreStrings();
  const { addNode } = useStoreFlowchart();
  const { screenToFlowPosition } = useReactFlow();
  const [mouseHover, setMouseHover] = useState<boolean>(false);

  const boxStyle = getRoleBoxStyle(role);

  function onDragStart(event: React.DragEvent<HTMLDivElement>): void {
    event.dataTransfer.setData("application/text", role);
    event.dataTransfer.effectAllowed = "move";
  }

  function onClick(): void {
    const paneBounds = document
      .querySelector(".react-flow")
      ?.getBoundingClientRect();
    const center = paneBounds
      ? {
          x: paneBounds.left + paneBounds.width / 2,
          y: paneBounds.top + paneBounds.height / 2,
        }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const jitter = () => _.random(-20, 20);
    addNode(
      role,
      screenToFlowPosition({ x: center.x + jitter(), y: center.y + jitter() }),
    );
  }

  return (
    <div
      className="text-center fw-bold small"
      draggable={true}
      onDragStart={onDragStart}
      onClick={onClick}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      style={{
        cursor: "grab",
        lineHeight: "40px",
        width: 120,
        color: boxStyle.textColor,
        background: mouseHover
          ? colors.darker(boxStyle.backgroundColor)
          : boxStyle.backgroundColor,
        borderRadius: boxStyle.borderRadius,
        clipPath: boxStyle.clipPath,
      }}
    >
      <span>{getString(`BlockTitle_${role}`)}</span>
    </div>
  );
}
