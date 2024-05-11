import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Position, useReactFlow } from "reactflow";

import NodeModal from "~/components/Modals/NodeModal";
import { BlockTypeId, getBlockType } from "~/core/blockTypes";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";
import palette from "~/utils/palette";

import Box from "./Box";
import Button from "./Button";
import DropZone from "./DropZone";
import Label from "./Label";
import MyHandleSource from "./MyHandleSource";
import MyHandleTarget from "./MyHandleTarget";

interface Props {
  nodeId: string;
  blockTypeId: BlockTypeId;
}

export default function ({ nodeId, blockTypeId }: Props): JSX.Element {
  const labelRef = useRef<HTMLSpanElement>(null);

  const [margin, setMargin] = useState<number>(0);
  const [boxFilter, setBoxFilter] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    isDraggingNode,
    connectionSource,
    mouseOverNodeId,
    setMouseOverNodeId,
  } = useStoreEphemeral();
  const { flowchart, deleteNode } = useStoreFlowchart();
  const { machineState } = useStoreMachine();
  const { language } = useStoreStrings();

  const { getZoom } = useReactFlow();

  const node = _.find(flowchart.nodes, { id: nodeId });
  const { handles, boxStyle } = getBlockType(blockTypeId);

  useEffect(() => {
    if (labelRef.current !== null) {
      const zoom = getZoom();
      const labelWidth = labelRef.current.getBoundingClientRect().width / zoom;
      const newNodeWidth = Math.min(40 + 20 * Math.ceil(labelWidth / 20), 480);
      setMargin((newNodeWidth - labelWidth) / 2);
    }
  }, [node, language]);

  function getDropShadow(color: string): string {
    return `drop-shadow(+2px 0 2px ${color})
      drop-shadow(-2px 0 2px ${color})
      drop-shadow(0 +2px 2px ${color})
      drop-shadow(0 -2px 2px ${color})`;
  }

  useEffect(() => {
    setBoxFilter(() => {
      if (_.some(machineState.errors, { nodeId })) {
        return getDropShadow(palette.red);
      } else if (blockTypeId === "start" && machineState.status === "ready") {
        return getDropShadow(palette.gray800);
      } else if (nodeId === machineState.curNodeId) {
        return getDropShadow(palette.gray800);
      }
      return "";
    });
  }, [machineState]);

  function onClickDelete() {
    deleteNode(nodeId);
    setMouseOverNodeId(null);
  }

  function onClickEdit() {
    setMouseOverNodeId(null);
    setShowModal(true);
  }

  if (node === undefined) return <></>;

  const isSelected = node.selected ?? false;
  const isMouseHover = mouseOverNodeId === nodeId;
  const isDeleteVisible =
    isMouseHover && !isDraggingNode && connectionSource === null;
  const isEditVisible =
    isDeleteVisible && !_.includes(["start", "end"], node.type);
  return (
    <>
      <div
        onMouseEnter={() => setMouseOverNodeId(nodeId)}
        onMouseLeave={() => setMouseOverNodeId(null)}
        style={{ cursor: isDraggingNode ? "grabbing" : "grab" }}
      >
        <Box
          boxStyle={boxStyle}
          boxFilter={boxFilter}
          isSelected={isSelected}
          isMouseHover={isMouseHover}
        >
          <>
            <span
              className="d-block text-truncate"
              ref={labelRef}
              style={{
                minWidth: "40px",
                maxWidth: "392px",
                marginLeft: `${margin}px`,
                marginRight: `${margin}px`,
              }}
            >
              <Label node={node} />
            </span>
          </>
        </Box>
        <Button
          variant="danger"
          top={-8}
          right={-8}
          icon="bi-trash-fill"
          visible={isDeleteVisible}
          onClick={onClickDelete}
        />
        <Button
          variant="primary"
          bottom={-8}
          right={-8}
          icon="bi-pencil-fill"
          visible={isEditVisible}
          onClick={onClickEdit}
        />
        <MyHandleTarget id="out" />
        {_.map(handles, ({ id, label }, index) => (
          <MyHandleSource
            key={index}
            id={id}
            position={node.data.handlePositions[id]}
            label={label}
            boxStyle={boxStyle}
          />
        ))}
        {_.map(
          _.difference(_.values(Position), _.values(node.data.handlePositions)),
          (position, index) => (
            <DropZone key={index} nodeId={nodeId} position={position} />
          ),
        )}
      </div>
      <NodeModal
        node={node}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}
