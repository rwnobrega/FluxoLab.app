import React, { useState } from "react";

import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

export default function (): JSX.Element {
  const [editMode, setEditMode] = useState(false);
  const { flowchart, setTitle } = useStoreFlowchart();
  const { getString } = useStoreStrings();

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
    setEditMode(true);
  };

  const onBlur = () => {
    setEditMode(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      setEditMode(false);
      event.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      className="form-control bg-dark text-white fs-4"
      placeholder={getString("FlowchartTitle_Placeholder")}
      value={flowchart.title}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      onKeyDown={onKeyDown}
      style={{ borderColor: editMode ? "white" : "black" }}
    />
  );
}
