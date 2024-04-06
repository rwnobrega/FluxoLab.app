import _ from "lodash";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { Node, useReactFlow } from "reactflow";

import { palette, getDropShadow } from "utils/colors";

import { Block } from "components/Blocks";

import Box from "components/Blocks/Box";
import Modal from "components/Blocks/Modal";
import Label from "components/Blocks/Label";

import MyHandleSource from "./MyHandleSource";
import MyHandleTarget from "./MyHandleTarget";
import ButtonDelete from "./ButtonDelete";
import ButtonEdit from "./ButtonEdit";

import useStoreEphemeral from "stores/useStoreEphemeral";
import useStoreFlow from "stores/useStoreFlow";
import useStoreMachine from "stores/useStoreMachine";
import useStoreMachineState from "stores/useStoreMachineState";
import useStoreStrings from "stores/useStoreStrings";

interface Props {
  nodeId: string;
  block: Block;
}

export default function ({ nodeId, block }: Props): JSX.Element {
  const [margin, setMargin] = useState<number>(0);
  const [boxFilter, setBoxFilter] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const { title, prefixLabel, boxStyle, modal, handles } = block;

  const { nodes, deleteNode, updateNodeProp } = useStoreFlow();
  const {
    isDraggingNode,
    isConnectingEdge,
    mouseOverNodeId,
    setMouseOverNodeId,
  } = useStoreEphemeral();
  const { compileErrors } = useStoreMachine();
  const { getState } = useStoreMachineState();
  const { getString, language } = useStoreStrings();
  const { getZoom } = useReactFlow();

  const state = getState();

  const labelRef = useRef<HTMLInputElement>(null);

  const node: Node | undefined = _.find(nodes, { id: nodeId });

  useEffect(() => {
    const MAX_WIDTH = 480;
    if (labelRef.current !== null) {
      const zoom = getZoom();
      const labelWidth = labelRef.current.getBoundingClientRect().width / zoom;
      const newNodeWidth = Math.min(
        40 + 40 * Math.ceil(labelWidth / 40),
        MAX_WIDTH,
      );
      const marginWidth = (newNodeWidth - labelWidth) / 2;
      if (node?.width !== undefined && node.width !== null) {
        updateNodeProp(
          nodeId,
          "position.x",
          node.position.x - (newNodeWidth - node.width) / 2,
        );
      }
      setMargin(marginWidth);
    }
  }, [node?.data, language]);

  useEffect(() => {
    setBoxFilter(() => {
      if (compileErrors.length > 0) {
        if (_.some(compileErrors, { nodeId })) {
          return getDropShadow(palette.red);
        }
      } else if (nodeId === state.curBlockId) {
        if (state.status === "error") {
          return getDropShadow(palette.red);
        } else {
          return getDropShadow(palette.gray800);
        }
      } else if (node?.type === "start" && state.curBlockId === null) {
        return getDropShadow(palette.gray800);
      }
      return "";
    });
  }, [state, compileErrors]);

  const handleDelete = useCallback(() => {
    deleteNode(nodeId);
    setMouseOverNodeId(null);
  }, [deleteNode, nodeId, setMouseOverNodeId]);

  const handleEdit = useCallback(() => {
    setMouseOverNodeId(null);
    setShowModal(true);
  }, [setMouseOverNodeId, setShowModal]);

  const onMouseEnter = useCallback(() => {
    setMouseOverNodeId(nodeId);
  }, [setMouseOverNodeId, nodeId]);

  const onMouseLeave = useCallback(() => {
    setMouseOverNodeId(null);
  }, [setMouseOverNodeId]);

  const buttonsVisible =
    mouseOverNodeId === nodeId && !isDraggingNode && !isConnectingEdge;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: "grab" }}
    >
      {modal !== undefined && (
        <Modal
          title={getString(title)}
          prefixLabel={
            prefixLabel !== undefined ? getString(prefixLabel) : undefined
          }
          prefixCommand={modal.prefixCommand}
          matchStartRule={modal.matchStartRule}
          placeholder={getString(modal.placeholder)}
          nodeId={nodeId}
          value={node?.data}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <Box
        boxStyle={boxStyle}
        boxFilter={boxFilter}
        isSelected={node?.selected}
      >
        <span
          ref={labelRef}
          style={{
            minWidth: "40px",
            maxWidth: "392px",
            marginLeft: `${margin}px`,
            marginRight: `${margin}px`,
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            verticalAlign: "middle",
            textOverflow: "ellipsis",
            color: boxStyle.textColor,
            cursor: "grab",
          }}
        >
          <Label
            prefixLabel={
              prefixLabel !== undefined ? getString(prefixLabel) : ""
            }
            value={node?.data}
          />
        </span>
      </Box>
      <ButtonDelete onClick={handleDelete} visible={buttonsVisible} />
      <ButtonEdit
        onClick={handleEdit}
        visible={buttonsVisible && modal !== undefined}
      />
      {_.map(handles, (props, index) =>
        props.type === "source" ? (
          <MyHandleSource key={index} boxStyle={boxStyle} {...props} />
        ) : (
          <MyHandleTarget key={index} boxStyle={boxStyle} {...props} />
        ),
      )}
    </div>
  );
}
