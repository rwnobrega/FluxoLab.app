import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  EdgeTypes,
  NodeTypes,
  useReactFlow,
} from "reactflow";

import Stack from "react-bootstrap/Stack";

import PlayButtons from "components/PlayButtons";
import StatusMessage from "components/StatusMessage";
import symbols from "components/Symbols";

import MyEdge from "./MyEdge";
import ConnectionLine from "./MyEdge/ConnectionLine";
import MyNode from "./MyNode";

import useStoreFlow from "stores/useStoreFlow";
import useStoreEphemeral from "stores/useStoreEphemeral";

const edgeTypes: EdgeTypes = { edge: MyEdge };

const nodeTypes: NodeTypes = {};
for (const { type, ...otherProps } of symbols) {
  nodeTypes[type] = ({ id }) => <MyNode nodeId={id} {...otherProps} />;
}

export default function (): JSX.Element {
  const { nodes, edges, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStoreFlow();
  const { setIsDraggingNode, setIsConnectingEdge } = useStoreEphemeral();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const { type, mouseX, mouseY } = JSON.parse(
        event.dataTransfer.getData("application/reactflow"),
      );
      const position = screenToFlowPosition({
        x: event.clientX - mouseX,
        y: event.clientY - mouseY,
      });
      addNode(type, position);
    },
    [addNode, screenToFlowPosition],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
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
      onNodeDragStart={() => setIsDraggingNode(true)}
      onNodeDragStop={() => setIsDraggingNode(false)}
      multiSelectionKeyCode="Shift"
      selectionKeyCode="Control"
      deleteKeyCode="Delete"
      disableKeyboardA11y
      snapToGrid
      snapGrid={[20, 20]}
    >
      <Stack
        direction="horizontal"
        gap={3}
        className="position-absolute top-0 start-0 m-3"
        style={{ zIndex: 5, alignItems: "start" }}
      >
        <PlayButtons />
        <StatusMessage />
      </Stack>
      <Controls />
      <Background gap={20} />
    </ReactFlow>
  );
}
