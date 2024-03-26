import _ from "lodash";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { Node, HandleType, Position, useReactFlow } from "reactflow";

import { palette, getDropShadow } from "utils/colors";

import { BoxStyle, LabelProps, ModalProps } from "components/Symbols";

import SymbolBox from "components/Symbols/SymbolBox";

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
  boxStyle: BoxStyle;
  Modal?: (props: ModalProps) => JSX.Element;
  Label: (props: LabelProps) => JSX.Element;
  handles: Array<{ id: string; type: HandleType; position: Position }>;
}

export default function ({
  nodeId,
  boxStyle,
  Modal,
  Label,
  handles,
}: Props): JSX.Element {
  const [margin, setMargin] = useState<number>(0);
  const [boxFilter, setBoxFilter] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const { nodes, deleteNode, updateNodeProp } = useStoreFlow();
  const {
    isDraggingNode,
    isConnectingEdge,
    mouseOverNodeId,
    setMouseOverNodeId,
  } = useStoreEphemeral();
  const { compileErrors } = useStoreMachine();
  const { getState } = useStoreMachineState();
  const { language } = useStoreStrings();
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
      } else if (nodeId === state.curSymbolId) {
        if (state.status === "error") {
          return getDropShadow(palette.red);
        } else {
          return getDropShadow(palette.gray800);
        }
      } else if (node?.type === "start" && state.curSymbolId === null) {
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
      {Modal !== undefined && (
        <Modal
          nodeId={nodeId}
          value={node?.data}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <SymbolBox
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
          <Label value={node?.data} />
        </span>
      </SymbolBox>
      <ButtonDelete onClick={handleDelete} visible={buttonsVisible} />
      <ButtonEdit
        onClick={handleEdit}
        visible={buttonsVisible && Modal !== undefined}
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
