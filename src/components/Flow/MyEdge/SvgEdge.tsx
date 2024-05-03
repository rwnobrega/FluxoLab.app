import React, { useState } from "react";
import { Position } from "reactflow";

import colors from "~/utils/colors";
import palette from "~/utils/palette";

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
  const strokeColor = colors.darker(
    selected ? palette.blue : palette.gray500,
    mouseHover ? 48 : 0,
  );

  return (
    <g fill="none">
      {/* Draw a white edge behind the main edge */}
      <path d={svgPathString} stroke="white" strokeWidth={2} />
      {/* Draw the edge */}
      <path
        d={svgPathString}
        stroke={strokeColor}
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
        strokeDasharray={animated ? 5 : 0}
        style={{
          animation: animated ? "dashdraw 0.5s linear infinite" : "none",
        }}
      />
      {/* Draw the arrowhead */}
      <path
        d={arrowheadSvgPathString(targetX, targetY, targetPosition)}
        stroke={strokeColor}
        fill={strokeColor}
      />
      {/* Below is a hack to make the edge more clickable */}
      <path
        d={svgPathString}
        stroke="transparent"
        strokeWidth={16}
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
