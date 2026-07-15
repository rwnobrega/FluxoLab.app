import _ from "lodash";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Stack from "react-bootstrap/Stack";
import { Group, Panel, Separator } from "react-resizable-panels";
import { ReactFlowProvider } from "reactflow";

import { traceToMarkdown } from "~/core/traceTable";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";
import palette from "~/utils/palette";

import Flow from "./Flow";
import Tooltip from "./General/Tooltip";
import Hotkeys from "./Hotkeys";
import Navbar from "./Navbar";
import Blocks from "./Panels/BlockList";
import InputOutput from "./Panels/InputOutput";
import TraceTable from "./Panels/TraceTable";
import Variables from "./Panels/Variables";
import Toaster from "./Toaster";
import Updater from "./Updater";
import UrlImporter from "./UrlImporter";

export default function (): JSX.Element {
  const [rightTab, setRightTab] = useState<"workspace" | "trace">("workspace");

  const { getString } = useStoreStrings();
  const { flowchart, addVariable } = useStoreFlowchart();
  const { stateHistory, machineState } = useStoreMachine();
  const { triggerToast } = useStoreEphemeral();

  // The desk-check has content once at least one step has been taken.
  const hasTrace = stateHistory.length > 0;

  const handleCopyTrace = () => {
    const markdown = traceToMarkdown(
      flowchart,
      [...stateHistory, machineState],
      getString,
    );
    void navigator.clipboard.writeText(markdown);
    triggerToast({
      message: getString("ToastMessage_CopyTraceTable"),
      icon: "bi-clipboard-check",
      background: "secondary",
    });
  };

  // Contextual action shown at the right of the tab bar (avoids repeating a
  // per-panel header that just echoes the tab name).
  const tabAction =
    rightTab === "workspace" ? (
      <Tooltip text={getString("VariableList_Add")}>
        <Button size="sm" className="fw-semibold" onClick={addVariable}>
          <i className="bi bi-plus-lg" />
        </Button>
      </Tooltip>
    ) : (
      <Button
        size="sm"
        variant="secondary"
        className="fw-semibold text-nowrap"
        disabled={!hasTrace}
        onClick={handleCopyTrace}
      >
        <i className="bi bi-clipboard me-1" />
        {getString("Button_Copy")}
      </Button>
    );

  const resizeHandleStyle = {
    padding: "3px",
    background: `repeating-linear-gradient(
      45deg,
      ${palette.gray300},
      ${palette.gray300} 2px,
      ${palette.gray100} 2px,
      ${palette.gray100} 4px
    )`,
    zIndex: 1,
  };

  return (
    <ReactFlowProvider>
      <Hotkeys />
      <Updater />
      <UrlImporter />
      <Toaster />
      <Stack className="vh-100 h-100" style={{ userSelect: "none" }}>
        <Navbar />
        <Group orientation="horizontal" id="fluxolab_main">
          <Panel
            className="left-panel-container"
            collapsible
            defaultSize={150}
            minSize={150}
            maxSize={150}
            collapsedSize={0}
          >
            <Blocks />
          </Panel>
          <Separator style={resizeHandleStyle} />
          <Panel>
            <Flow />
          </Panel>
          <Separator style={resizeHandleStyle} />
          <Panel collapsible defaultSize={400} minSize={300}>
            <div className="d-flex flex-column h-100 bg-light">
              <Nav
                variant="tabs"
                activeKey={rightTab}
                onSelect={(key) =>
                  setRightTab((key as "workspace" | "trace") ?? "workspace")
                }
                className="flex-nowrap align-items-center px-2 pt-2"
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="workspace"
                    className={`py-1 text-nowrap text-black ${
                      rightTab === "workspace" ? "fw-bold" : ""
                    }`}
                  >
                    {getString("RightTab_Workspace")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="trace"
                    className={`py-1 text-nowrap text-black ${
                      rightTab === "trace" ? "fw-bold" : ""
                    }`}
                  >
                    {getString("TraceTable_Title")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="ms-auto pb-1">{tabAction}</Nav.Item>
              </Nav>
              <div className="flex-fill" style={{ minHeight: 0 }}>
                {rightTab === "workspace" ? (
                  <Group orientation="vertical" id="fluxolab_right">
                    <Panel defaultSize="40%" minSize="20%" className="p-3">
                      <Variables />
                    </Panel>
                    <Separator style={resizeHandleStyle} />
                    <Panel defaultSize="60%" minSize="20%" className="p-3">
                      <InputOutput />
                    </Panel>
                  </Group>
                ) : (
                  <div className="p-3 h-100">
                    <TraceTable />
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </Group>
      </Stack>
    </ReactFlowProvider>
  );
}
