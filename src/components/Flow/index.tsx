import React from "react";
import Stack from "react-bootstrap/Stack";
import ReactFlow, {
  Background,
  Controls,
  EdgeTypes,
  NodeTypes,
  useReactFlow,
} from "reactflow";

import PlayButtons from "~/components/PlayButtons";
import StatusMessage from "~/components/StatusMessage";
import { BlockTypeId, blockTypeIds } from "~/core/blockTypes";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";

import MyEdge from "./MyEdge";
import ConnectionLine from "./MyEdge/ConnectionLine";
import MyNode from "./MyNode";

const edgeTypes: EdgeTypes = { edge: MyEdge };

const nodeTypes: NodeTypes = {};
for (const blockTypeId of blockTypeIds) {
  nodeTypes[blockTypeId] = ({ id }) => (
    <MyNode nodeId={id} blockTypeId={blockTypeId} />
  );
}

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
  const { setIsDraggingNode, setIsConnectingEdge } = useStoreEphemeral();
  const { getViewport, screenToFlowPosition } = useReactFlow();

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/text");
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    if (blockTypeIds.includes(type as BlockTypeId)) {
      addNode(type as BlockTypeId, position);
    }
  };

  return (
    <ReactFlow
      nodes={flowchart.nodes}
      edges={flowchart.edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultEdgeOptions={{ type: "edge" }}
      connectionLineComponent={ConnectionLine}
      onConnect={onConnect}
      onConnectEnd={() => setIsConnectingEdge(false)}
      onConnectStart={() => setIsConnectingEdge(true)}
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
