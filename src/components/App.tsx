import _ from "lodash";
import React, { useEffect } from "react";
import Stack from "react-bootstrap/Stack";
import { Group, Panel, Separator } from "react-resizable-panels";
import { ReactFlowProvider } from "reactflow";

import useStoreEphemeral from "~/store/useStoreEphemeral";
import palette from "~/utils/palette";

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
  const leftPanelRef = useStoreEphemeral((state) => state.leftPanelRef);
  const setLeftPanelVisible = useStoreEphemeral(
    (state) => state.setLeftPanelVisible,
  );

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

  // 2. Garantimos que o painel comece com o tamanho correto em pixels
  useEffect(() => {
    if (leftPanelRef.current) {
      leftPanelRef.current.resize("150px");
    }
  }, [leftPanelRef]);

  return (
    <ReactFlowProvider>
      <Hotkeys />
      <Updater />
      <UrlImporter />
      <Toaster />
      <Stack className="vh-100 h-100" style={{ userSelect: "none" }}>
        <Navbar />

        <Group orientation="horizontal" id="fluxolab_main">
          {/* Painel Esquerdo - Blocos do fluxograma */}
          <Panel
            className="left-panel-container"
            {...({
              ref: leftPanelRef,
              collapsible: true,
              defaultSize: "150px",
              minSize: 70,
              collapsedSize: 0,
              onCollapse: () => setLeftPanelVisible(false),
              onExpand: () => setLeftPanelVisible(true),
            } as any)}
          >
            <div
              className="bg-light p-3 h-100"
              style={{
                minWidth: "150px",
                maxWidth: "100%",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <Blocks />
            </div>
          </Panel>

          <Separator style={{ width: "6px", ...resizeHandleStyle }} />

          {/* Painel Central (Editor de Fluxo) */}
          <Panel minSize={30}>
            <Flow />
          </Panel>

          <Separator style={{ width: "6px", ...resizeHandleStyle }} />

          {/* Painel Direito */}
          <Panel defaultSize={400} minSize={300}>
            <Group
              orientation="vertical"
              id="fluxolab_right"
              className="bg-light"
            >
              <Panel defaultSize={40} minSize={24} className="p-3">
                <Variables />
              </Panel>

              <Separator style={{ height: "6px", ...resizeHandleStyle }} />

              <Panel defaultSize={60} className="p-3">
                <InputOutput />
              </Panel>
            </Group>
          </Panel>
        </Group>
      </Stack>
    </ReactFlowProvider>
  );
}
