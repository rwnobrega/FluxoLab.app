import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

import Tooltip from "~/components/General/Tooltip";
import { serialize } from "~/store/serialize";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

import Clear from "./Clear";

export default function (): JSX.Element {
  const [showClear, setShowClear] = useState(false);

  const { flowchart } = useStoreFlowchart();
  const { triggerToast } = useStoreEphemeral();
  const { getString } = useStoreStrings();

  const handleCopyLink = () => {
    const lzs = serialize(flowchart);
    const baseUrl = window.location.href.split("?")[0];
    void navigator.clipboard.writeText(`${baseUrl}?lzs=${lzs}`);
    triggerToast({
      message: getString("ToastMessage_CopyLink"),
      icon: "bi-clipboard-check",
      background: "secondary",
    });
  };

  return (
    <>
      <Dropdown align="end">
        <Tooltip text={getString("MenuFlowchart_Tooltip")}>
          <Dropdown.Toggle>
            <i className="bi bi-bounding-box-circles" />
          </Dropdown.Toggle>
        </Tooltip>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowClear(true)}>
            {getString("MenuFlowchart_Clear")}
          </Dropdown.Item>
          <Dropdown.Item onClick={handleCopyLink}>
            {getString("MenuFlowchart_CopyLink")}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Clear showModal={showClear} setShowModal={setShowClear} />
    </>
  );
}
