import _ from "lodash";
import React, { useMemo } from "react";
import Stack from "react-bootstrap/Stack";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";

import PlayButtons from "~/components/PlayButtons";
import StatusMessage from "~/components/StatusMessage";
import { Role } from "~/core/roles";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";

import MyEdge from "./MyEdge";
import ConnectionLine from "./MyEdge/ConnectionLine";
import MyNode from "./MyNode";

export default function (): JSX.Element {
  const {
    flowchart,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    savedViewport,
    setSavedViewport,
  } = useStoreFlowchart();
  const {
    isEditingHandles,
    connectionSource,
    setIsDraggingNode,
    setConnectionSource,
  } = useStoreEphemeral();
  const { getViewport, screenToFlowPosition } = useReactFlow();

  const updateNodeInternals = useUpdateNodeInternals();

  const isValidConnection = (connection: Connection) => {
    if (!isEditingHandles) {
      // Normal connection
      return (
        connection.targetHandle === "out" &&
        connection.source !== connection.target
      );
    } else {
      // Repositioning a handle
      return (
        connection.targetHandle !== "out" &&
        connection.source === connection.target
      );
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const role = event.dataTransfer.getData("application/text");
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    if (_.includes(Role, role)) {
      addNode(role as Role, position);
    }
  };

  const onConnectWrapper = (params: Connection) => {
    return onConnect(isEditingHandles, params);
  };

  const onConnectStart = (_event: React.MouseEvent, { nodeId }: any) => {
    setConnectionSource(nodeId);
  };

  const onConnectEnd = () => {
    if (connectionSource !== null) {
      updateNodeInternals(connectionSource);
    }
    setConnectionSource(null);
  };

  const nodeTypes = useMemo(() => ({ MyNode: MyNode }), []);
  const edgeTypes = useMemo(() => ({ MyEdge: MyEdge }), []);

  return (
    <ReactFlow
      nodes={flowchart.nodes}
      edges={flowchart.edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultEdgeOptions={{ type: "MyEdge" }}
      isValidConnection={isValidConnection}
      connectionLineComponent={ConnectionLine}
      onConnect={onConnectWrapper}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMoveEnd={() => setSavedViewport(getViewport())}
      onNodeDragStart={() => setIsDraggingNode(true)}
      onNodeDragStop={() => setIsDraggingNode(false)}
      defaultViewport={savedViewport}
      multiSelectionKeyCode="Control"
      selectionKeyCode="Shift"
      deleteKeyCode="Delete"
      disableKeyboardA11y
      snapToGrid
      snapGrid={[20, 20]}
      nodeOrigin={[0.5, 0.5]}
    >
      <div className="position-relative m-3">
        <Stack
          direction="horizontal"
          gap={3}
          className="justify-content-between align-items-start"
        >
          <PlayButtons />
          <StatusMessage />
        </Stack>
      </div>
      <Controls
        onZoomIn={() => setSavedViewport(getViewport())}
        onZoomOut={() => setSavedViewport(getViewport())}
        onFitView={() => setSavedViewport(getViewport())}
      />
      <Background gap={20} />
    </ReactFlow>
  );
}
