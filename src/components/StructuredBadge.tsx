import React, { useMemo } from "react";

import Tooltip from "~/components/General/Tooltip";
import { structurize } from "~/core/pseudocode";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";
import palette from "~/utils/palette";

export default function (): JSX.Element {
  const { flowchart } = useStoreFlowchart();
  const { isDraggingNode, connectionSource } = useStoreEphemeral();
  const { getString } = useStoreStrings();

  const result = useMemo(
    () => structurize(flowchart),
    [flowchart.nodes, flowchart.edges],
  );

  if (isDraggingNode || connectionSource !== null) return <></>;

  // Structuredness is a property of the flowchart topology; while the
  // topology itself is incomplete (e.g. missing connections), there is
  // nothing meaningful to report, and the status message already shows
  // the corresponding errors.
  if (!result.ok && result.reason === "invalid") return <></>;

  const suffix = result.ok ? "Yes" : "No";
  const backgroundColor = result.ok ? palette.green : palette.orange;
  const icon = result.ok ? "bi-diagram-3-fill" : "bi-shuffle";

  return (
    <Tooltip text={getString(`StructuredBadge_Tooltip${suffix}`)}>
      <span
        className="badge rounded-pill text-white"
        style={{ backgroundColor, zIndex: 10 }}
      >
        <i className={`bi ${icon} me-1`} />
        {getString(`StructuredBadge_${suffix}`)}
      </span>
    </Tooltip>
  );
}
