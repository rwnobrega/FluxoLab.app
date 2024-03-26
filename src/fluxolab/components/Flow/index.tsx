import React, { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  EdgeTypes,
  NodeTypes,
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
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const { nodes, edges, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStoreFlow();
  const { setIsDraggingNode, setIsConnectingEdge } = useStoreEphemeral();

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
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - mouseX,
        y: event.clientY - mouseY,
      });
      addNode(type, position);
    },
    [reactFlowInstance],
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
      onConnectStart={() => setIsConnectingEdge(true)}
      onConnectEnd={() => setIsConnectingEdge(false)}
      onNodeDragStart={() => setIsDraggingNode(true)}
      onNodeDragStop={() => setIsDraggingNode(false)}
      onInit={setReactFlowInstance}
      onDrop={onDrop}
      onDragOver={onDragOver}
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
