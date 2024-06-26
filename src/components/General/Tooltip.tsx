import { Tooltip as BsTooltip } from "bootstrap";
import React, { useEffect, useRef } from "react";

interface Props {
  children: JSX.Element;
  text: string;
}

export default function ({ children, text }: Props): JSX.Element {
  const childRef = useRef<string>("");

  useEffect(() => {
    const t = new BsTooltip(childRef.current, {
      title: text,
      placement: "bottom",
      trigger: "hover",
    });
    return () => t.dispose();
  }, [text]);

  return React.cloneElement(children, { ref: childRef });
}
