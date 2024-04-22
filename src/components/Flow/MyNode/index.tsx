import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Node, useReactFlow } from "reactflow";

import { Block } from "~/components/Blocks";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlow from "~/store/useStoreFlow";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreMachineState from "~/store/useStoreMachineState";
import useStoreStrings from "~/store/useStoreStrings";
import { getDropShadow, palette } from "~/utils/colors";

import Box from "./Box";
import ButtonDelete from "./ButtonDelete";
import ButtonEdit from "./ButtonEdit";
import Label from "./Label";
import Modal from "./Modal";
import MyHandleSource from "./MyHandleSource";
import MyHandleTarget from "./MyHandleTarget";

interface Props {
  nodeId: string;
  block: Block;
}

export default function ({ nodeId, block }: Props): JSX.Element {
  const [margin, setMargin] = useState<number>(0);
  const [boxFilter, setBoxFilter] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const { title, prefixLabel, boxStyle, modal, handles } = block;

  const { nodes, deleteNode } = useStoreFlow();
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

  const labelRef = useRef<HTMLSpanElement>(null);

  const node: Node | undefined = _.find(nodes, { id: nodeId });

  useEffect(() => {
    if (labelRef.current !== null) {
      const zoom = getZoom();
      const labelWidth = labelRef.current.getBoundingClientRect().width / zoom;
      const newNodeWidth = Math.min(40 + 20 * Math.ceil(labelWidth / 20), 480);
      setMargin((newNodeWidth - labelWidth) / 2);
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

  function handleDelete() {
    deleteNode(nodeId);
    setMouseOverNodeId(null);
  }

  function handleEdit() {
    setMouseOverNodeId(null);
    setShowModal(true);
  }

  const isSelected = node?.selected ?? false;
  const isMouseHover = mouseOverNodeId === nodeId;
  const isDeleteVisible = isMouseHover && !isDraggingNode && !isConnectingEdge;
  const isEditVisible = isDeleteVisible && modal !== undefined;

  return (
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
          <Label
            prefixLabel={getString(prefixLabel ?? "")}
            value={node?.data}
          />
        </span>
      </Box>
      <ButtonDelete onClick={handleDelete} visible={isDeleteVisible} />
      <ButtonEdit onClick={handleEdit} visible={isEditVisible} />
      {_.map(handles, (props, index) =>
        props.type === "source" ? (
          <MyHandleSource key={index} boxStyle={boxStyle} {...props} />
        ) : (
          <MyHandleTarget key={index} boxStyle={boxStyle} {...props} />
        ),
      )}
      {modal !== undefined && (
        <Modal
          title={getString(title)}
          prefixLabel={getString(prefixLabel ?? "")}
          prefixCommand={modal.prefixCommand}
          matchStartRule={modal.matchStartRule}
          placeholder={getString(modal.placeholder)}
          nodeId={nodeId}
          value={node?.data}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}
