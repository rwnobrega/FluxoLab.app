import _ from "lodash";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/Stack";

import Markdown from "~/components/General/Markdown";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";
import palette from "~/utils/palette";

interface StatusProps {
  backgroundColor: string;
  statusIcon: string;
  mainStatus: string;
  smallStatus?: string[];
}

export default function (): JSX.Element {
  const { isDraggingNode, isConnectingEdge, mouseOverNodeId } =
    useStoreEphemeral();
  const { machineState } = useStoreMachine();
  const { getString } = useStoreStrings();

  if (isDraggingNode || isConnectingEdge) return <></>;

  function getStatusProps(): StatusProps {
    const { status, errors, timeSlot } = machineState;
    switch (status) {
      case "ready":
        return {
          backgroundColor: palette.purple,
          statusIcon: "bi-check-circle-fill",
          mainStatus: getString("Status_Ready"),
        };

      case "running":
        return {
          backgroundColor: palette.green,
          statusIcon: "bi-check-circle-fill",
          mainStatus: getString("Status_Running", { step: timeSlot }),
        };

      case "waiting":
        return {
          backgroundColor: palette.blue,
          statusIcon: "bi-hourglass-split",
          mainStatus: getString("Status_Waiting"),
        };

      case "halted":
        return {
          backgroundColor: palette.purple,
          statusIcon: "bi-check-circle-fill",
          mainStatus: getString("Status_Halted"),
        };

      case "exception":
        return {
          backgroundColor: palette.red,
          statusIcon: "bi-exclamation-circle-fill",
          mainStatus: getString(errors[0].message, errors[0].payload),
        };

      case "invalid": {
        const hoveredErrors = _.filter(errors, { nodeId: mouseOverNodeId });
        const nonNodeErrors = _.filter(errors, { nodeId: null });
        let mainStatus: string = "";
        let smallStatus: string[] = [];
        if (hoveredErrors.length === 0) {
          if (nonNodeErrors.length > 0) {
            const error = nonNodeErrors[0];
            mainStatus = getString(error.message, error.payload);
          } else {
            const count = errors.length;
            mainStatus = getString("Status_CompileErrors", { count });
          }
        } else if (hoveredErrors.length === 1) {
          const error = hoveredErrors[0];
          mainStatus = getString(error.message, error.payload);
        } else {
          mainStatus = getString("Status_MultipleErrors");
          smallStatus = _.map(hoveredErrors, (error) =>
            getString(error.message, error.payload),
          );
        }
        return {
          backgroundColor: palette.red,
          statusIcon: "bi-exclamation-triangle-fill",
          mainStatus,
          smallStatus,
        };
      }
    }
  }

  const { backgroundColor, statusIcon, mainStatus, smallStatus } =
    getStatusProps();

  return (
    <Alert
      className="m-0 border-0 text-white"
      style={{ backgroundColor, padding: "6px 12px", zIndex: 10 }}
    >
      <Stack direction="horizontal" className="align-items-start">
        <i className={`bi ${statusIcon}`} />
        <span className="ms-2" style={{ whiteSpace: "pre-wrap" }}>
          <Markdown source={mainStatus} />
          <Markdown className="small" source={smallStatus?.join("\n")} />
        </span>
      </Stack>
    </Alert>
  );
}
