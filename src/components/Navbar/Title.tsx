import React, { useRef, useState } from "react";

import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

export default function (): JSX.Element {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState("");
  const isCancelling = useRef(false);
  const { flowchart, setTitle } = useStoreFlowchart();
  const { getString } = useStoreStrings();

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setDraft(flowchart.title);
    event.target.select();
    setEditMode(true);
  };

  const onBlur = () => {
    if (!isCancelling.current) {
      setTitle(draft);
    }
    isCancelling.current = false;
    setEditMode(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
    if (event.key === "Escape") {
      isCancelling.current = true;
      event.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      className="form-control bg-dark text-white fs-4"
      placeholder={getString("FlowchartTitle_Placeholder")}
      value={editMode ? draft : flowchart.title}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      onKeyDown={onKeyDown}
      style={{ borderColor: editMode ? "white" : "black" }}
    />
  );
}
