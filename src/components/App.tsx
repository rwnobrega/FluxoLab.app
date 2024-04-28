import _ from "lodash";
import React from "react";
import Stack from "react-bootstrap/Stack";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ReactFlowProvider } from "reactflow";

import { palette } from "~/utils/colors";

import Flow from "./Flow";
import Hotkeys from "./Hotkeys";
import Navbar from "./Navbar";
import Blocks from "./Panels/BlockList";
import InputOutput from "./Panels/InputOutput";
import Variables from "./Panels/Variables";
import Toaster from "./Toaster";
import Updater from "./Updater";
import UrlImporter from "./UrlImporter";

export default function (): JSX.Element {
  const resizeHandleStyle = {
    backgroundColor: palette.gray300,
    background: `repeating-linear-gradient(
      45deg,
      ${palette.gray300},
      ${palette.gray300} 2px,
      ${palette.gray100} 2px,
      ${palette.gray100} 4px
    )`,
  };

  return (
    <ReactFlowProvider>
      <Stack className="vh-100 h-100" style={{ userSelect: "none" }}>
        <UrlImporter />
        <Hotkeys />
        <Toaster />
        <Navbar />
        <Updater />
        <PanelGroup direction="horizontal" autoSaveId="fluxolab_main">
          <div className="bg-light p-3">
            <Blocks />
          </div>
          <Panel defaultSize={70} minSize={50}>
            <Flow />
          </Panel>
          <PanelResizeHandle style={{ width: "6px", ...resizeHandleStyle }} />
          <Panel defaultSize={30} minSize={24}>
            <PanelGroup
              direction="vertical"
              autoSaveId="fluxolab_right"
              className="bg-light"
            >
              <Panel defaultSize={40} minSize={24} className="p-3">
                <Variables />
              </Panel>
              <PanelResizeHandle
                style={{ height: "6px", ...resizeHandleStyle }}
              />
              <Panel defaultSize={60} className="p-3">
                <InputOutput />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </Stack>
    </ReactFlowProvider>
  );
}
