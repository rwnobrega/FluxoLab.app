import React, { useState } from "react";

import { Role, getRoleBoxStyle } from "~/core/roles";
import useStoreStrings from "~/store/useStoreStrings";
import colors from "~/utils/colors";

interface Props {
  role: Role;
}

export default function ({ role }: Props): JSX.Element {
  const { getString } = useStoreStrings();
  const [mouseHover, setMouseHover] = useState<boolean>(false);

  const boxStyle = getRoleBoxStyle(role);

  function onDragStart(event: React.DragEvent<HTMLDivElement>): void {
    event.dataTransfer.setData("application/text", role);
    event.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      className="text-center fw-bold small"
      draggable={true}
      onDragStart={onDragStart}
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
