import _ from "lodash";

import React, { useEffect } from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { ReactFlowProvider } from "reactflow";

import Stack from "react-bootstrap/Stack";

import UrlImporter from "components/UrlImporter";
import Hotkeys from "components/Hotkeys";
import Toaster from "components/Toaster";
import Navbar from "components/Navbar";
import Flow from "components/Flow";
import Symbols from "components/Panels/Symbols";
import Variables from "components/Panels/Variables";
import InputOutput from "components/Panels/InputOutput";

import useStoreFlow from "stores/useStoreFlow";
import useStoreMachine from "stores/useStoreMachine";
import useStoreMachineState from "stores/useStoreMachineState";

import compile from "machine/compiler";

import { palette } from "utils/colors";

export default function (): JSX.Element {
  const { nodes, edges } = useStoreFlow();
  const { machine, setFlowchart, setStartSymbolId, setCompileErrors } =
    useStoreMachine();
  const { reset } = useStoreMachineState();

  const nodesDep = JSON.stringify(
    _.map(nodes, (node) => _.pick(node, ["id", "type", "data"])),
  );
  const edgesDep = JSON.stringify(
    _.map(edges, (edge) =>
      _.pick(edge, ["id", "source", "sourceHandle", "target", "targetHandle"]),
    ),
  );

  useEffect(() => {
    const { flowchart, startSymbolId, errors } = compile({
      nodes,
      edges,
      variables: machine.variables,
    });
    setStartSymbolId(startSymbolId);
    setFlowchart(flowchart);
    setCompileErrors(errors);
  }, [nodesDep, edgesDep, machine.variables]);

  useEffect(() => {
    reset(machine);
  }, [machine.flowchart, machine.startSymbolId]);

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
        <PanelGroup direction="horizontal" autoSaveId="fluxolab_main">
          <div className="bg-light p-3">
            <Symbols />
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
