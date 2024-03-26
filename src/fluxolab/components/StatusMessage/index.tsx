import _ from "lodash";

import React from "react";

import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/Stack";

import Markdown from "components/General/Markdown";

import useStoreEphemeral from "stores/useStoreEphemeral";
import useStoreMachine from "stores/useStoreMachine";
import useStoreMachineState from "stores/useStoreMachineState";
import useStoreStrings from "stores/useStoreStrings";

import { palette } from "utils/colors";

interface Triplet {
  backgroundColor: string;
  statusIcon: string;
  statusText: string;
}

export default function (): JSX.Element {
  const { compileErrors } = useStoreMachine();
  const { getState } = useStoreMachineState();
  const { isDraggingNode, isConnectingEdge, mouseOverNodeId } =
    useStoreEphemeral();
  const { getString } = useStoreStrings();

  if (isDraggingNode || isConnectingEdge) return <></>;

  const state = getState();

  function getTriplet(): Triplet {
    if (compileErrors.length > 0) {
      const hoveredNodeErrors = _.filter(compileErrors, {
        nodeId: mouseOverNodeId,
      });
      const nonNodeErrors = _.filter(compileErrors, { nodeId: null });
      let statusText: string;
      if (mouseOverNodeId === null || hoveredNodeErrors.length === 0) {
        if (nonNodeErrors.length > 0) {
          statusText = _.map(nonNodeErrors, (error) =>
            getString(error.message, error.payload),
          ).join("\n");
        } else {
          statusText = getString("Status_CompileErrors", {
            count: String(compileErrors.length),
          });
        }
      } else {
        if (hoveredNodeErrors.length === 1) {
          statusText = getString(
            hoveredNodeErrors[0].message,
            hoveredNodeErrors[0].payload,
          );
        } else {
          statusText = `${getString("Status_MultipleErrors")}\n`;
          statusText += _.map(hoveredNodeErrors, (error) =>
            getString(error.message, error.payload),
          ).join("\n");
        }
      }
      return {
        backgroundColor: palette.red,
        statusIcon: "bi-exclamation-triangle-fill",
        statusText: statusText,
      };
    } else if (state.status === "error") {
      if (state.error === null) {
        throw new Error("Machine state is in error status but error is null.");
      }
      return {
        backgroundColor: palette.red,
        statusIcon: "bi-exclamation-circle-fill",
        statusText: getString(state.error.message, state.error.payload),
      };
    } else if (state.status === "halted") {
      return {
        backgroundColor: palette.purple,
        statusIcon: "bi-check-circle-fill",
        statusText: getString("Status_Halted"),
      };
    } else if (state.timeSlot === -1) {
      return {
        backgroundColor: palette.purple,
        statusIcon: "bi-check-circle-fill",
        statusText: getString("Status_Ready"),
      };
    } else if (state.timeSlot === 0) {
      return {
        backgroundColor: palette.purple,
        statusIcon: "bi-play-circle-fill",
        statusText: getString("Status_Started"),
      };
    } else {
      return {
        backgroundColor: palette.green,
        statusIcon: "bi-check-circle-fill",
        statusText: getString("Status_Step", { step: String(state.timeSlot) }),
      };
    }
  }

  const { backgroundColor, statusIcon, statusText } = getTriplet();

  const [mainStatus, ...rest] = statusText.split("\n");
  const smallStatus = rest.join("\n");

  return (
    <Alert
      className="m-0 border-0"
      style={{ backgroundColor, color: "white", padding: "6px 12px" }}
    >
      <Stack direction="horizontal" style={{ alignItems: "start" }}>
        <i className={`bi ${statusIcon}`} />
        <span className="ms-2" style={{ whiteSpace: "pre-wrap" }}>
          <Markdown source={mainStatus} />
          <Markdown className="small" source={smallStatus} />
        </span>
      </Stack>
    </Alert>
  );
}
