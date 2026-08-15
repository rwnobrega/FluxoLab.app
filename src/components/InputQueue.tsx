import _ from "lodash";
import React from "react";
import Button from "react-bootstrap/Button";

import Tooltip from "~/components/General/Tooltip";
import { readArity } from "~/core/execute";
import { Role } from "~/core/roles";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";

interface Props {
  className?: string;
}

/**
 * The tokens that have been typed but not read yet. Without it the queue would
 * be invisible: a line answering three reads would look like it vanished after
 * the first one.
 */
export default function ({ className = "mb-2" }: Props): JSX.Element {
  const { flowchart } = useStoreFlowchart();
  const { machineState, clearInput } = useStoreMachine();
  const { getString } = useStoreStrings();

  const { inputBuffer, curNodeId, status } = machineState;
  if (inputBuffer.length === 0) return <></>;

  // Tokens the block under the highlight is about to take, marked apart from
  // the ones left for later reads.
  const node =
    curNodeId === null ? undefined : _.find(flowchart.nodes, { id: curNodeId });
  const pending =
    node !== undefined &&
    node.data.role === Role.Read &&
    (status === "running" || status === "waiting")
      ? readArity(node)
      : 0;

  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <small className="text-body-secondary text-nowrap">
        {getString("Interaction_Queue")}
      </small>
      <div className="d-flex flex-wrap gap-1 flex-fill" style={{ minWidth: 0 }}>
        {_.map(inputBuffer, (token, index) => (
          <span
            key={index}
            className={`badge font-monospace fw-normal ${
              index < pending ? "text-bg-primary" : "text-bg-secondary"
            }`}
            style={{ whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {token}
          </span>
        ))}
      </div>
      <Tooltip text={getString("Interaction_ClearQueue")}>
        <Button
          variant="link"
          size="sm"
          className="p-0 lh-1 text-body-secondary"
          onClick={clearInput}
        >
          <i className="bi bi-x-circle-fill" />
        </Button>
      </Tooltip>
    </div>
  );
}
