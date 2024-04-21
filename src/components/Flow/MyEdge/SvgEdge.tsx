import React, { useState } from "react";
import { Position } from "reactflow";

import { getDarkerColor, palette } from "~/utils/colors";

interface Props {
  svgPathString: string;
  selected: boolean;
  animated: boolean;
  targetX: number;
  targetY: number;
  targetPosition: Position;
}

export default function ({
  svgPathString,
  selected,
  animated,
  targetX,
  targetY,
  targetPosition,
}: Props): JSX.Element {
  const [mouseHover, setMouseHover] = useState<boolean>(false);

  return (
    <g>
      <path
        d={svgPathString}
        className="react-flow__edge-path"
        markerEnd="url(#arrowhead)"
        style={{
          strokeWidth: 2,
          stroke: getDarkerColor(
            selected ? palette.blue : palette.gray500,
            mouseHover ? 48 : 0,
          ),
          strokeDasharray: animated ? 5 : 0,
          animation: animated ? "dashdraw 0.5s linear infinite" : "none",
        }}
      />
      {/* Draw the arrowhead */}
      <path
        d={arrowheadSvgPathString(targetX, targetY, targetPosition)}
        fill={getDarkerColor(
          selected ? palette.blue : palette.gray500,
          mouseHover ? 48 : 0,
        )}
        stroke={getDarkerColor(
          selected ? palette.blue : palette.gray500,
          mouseHover ? 48 : 0,
        )}
      />
      {/* Below is a hack to make the edge more clickable */}
      <path
        d={svgPathString}
        className="react-flow__edge-path"
        style={{ strokeWidth: 16, strokeOpacity: 0 }}
        onMouseEnter={() => setMouseHover(true)}
        onMouseLeave={() => setMouseHover(false)}
      />
    </g>
  );
}

function arrowheadSvgPathString(
  targetX: number,
  targetY: number,
  targetPosition: Position,
): string {
  switch (targetPosition) {
    case Position.Top:
      return `M ${targetX} ${targetY} l 3.5 -9 l -7 0 z`;
    case Position.Bottom:
      return `M ${targetX} ${targetY} l 3.5 9 l -7 0 z`;
    case Position.Left:
      return `M ${targetX} ${targetY} l -9 3.5 l 0 -7 z`;
    case Position.Right:
      return `M ${targetX} ${targetY} l 9 3.5 l 0 -7 z`;
  }
}
