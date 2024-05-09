import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useReactFlow } from "reactflow";

import { BlockTypeId, getBlockType } from "~/core/blockTypes";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";
import palette from "~/utils/palette";

import Box from "./Box";
import ButtonDelete from "./ButtonDelete";
import ButtonEdit from "./ButtonEdit";
import Label from "./Label";
import Modal from "./Modal";
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
    isConnectingEdge,
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
  const isButtonVisible = isMouseHover && !isDraggingNode && !isConnectingEdge;

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
        </Box>
        <ButtonDelete onClick={onClickDelete} visible={isButtonVisible} />
        <ButtonEdit onClick={onClickEdit} visible={isButtonVisible} />
        {_.map(handles, ({ id, label }, index) => (
          <MyHandleSource
            key={index}
            id={id}
            position={node.data.handlePositions[id]}
            label={label}
            boxStyle={boxStyle}
          />
        ))}
        <MyHandleTarget id="out" />
      </div>
      <Modal node={node} showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}
