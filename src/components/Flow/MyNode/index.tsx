import _ from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";

import NodeModal from "~/components/Modals/NodeModal";
import { Role, getRoleBoxStyle, getRoleHandles } from "~/core/roles";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart, { NodeData } from "~/store/useStoreFlowchart";
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
  id: string;
  data: NodeData;
  selected: boolean;
}

export default function ({ id, data, selected }: Props): JSX.Element {
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

  useEffect(() => {
    if (labelRef.current !== null) {
      const zoom = getZoom();
      const labelWidth = labelRef.current.getBoundingClientRect().width / zoom;
      const newNodeWidth = Math.min(40 + 20 * Math.ceil(labelWidth / 20), 480);
      setMargin((newNodeWidth - labelWidth) / 2);
    }
  }, [language]);

  function getDropShadow(color: string): string {
    return `drop-shadow(+2px 0 2px ${color})
      drop-shadow(-2px 0 2px ${color})
      drop-shadow(0 +2px 2px ${color})
      drop-shadow(0 -2px 2px ${color})`;
  }

  useEffect(() => {
    setBoxFilter(() => {
      if (_.some(machineState.errors, { nodeId: id })) {
        return getDropShadow(palette.red);
      } else if (machineState.status === "ready" && data.role === Role.Start) {
        return getDropShadow(palette.gray800);
      } else if (id === machineState.curNodeId) {
        return getDropShadow(palette.gray800);
      }
      return "";
    });
  }, [machineState]);

  function onClickDelete() {
    deleteNode(id);
    setMouseOverNodeId(null);
  }

  function onClickEdit() {
    setMouseOverNodeId(null);
    setShowModal(true);
  }

  const boxStyle = getRoleBoxStyle(data.role);
  const handles = getRoleHandles(data.role);

  const isMouseHover = mouseOverNodeId === id;
  const isDeleteVisible =
    isMouseHover && !isDraggingNode && connectionSource === null;
  const isEditVisible =
    isDeleteVisible && !_.includes([Role.Start, Role.End], data.role);

  return (
    <>
      <div
        onMouseEnter={() => setMouseOverNodeId(id)}
        onMouseLeave={() => setMouseOverNodeId(null)}
        style={{ cursor: isDraggingNode ? "grabbing" : "grab" }}
      >
        <Box
          boxStyle={boxStyle}
          boxFilter={boxFilter}
          isSelected={selected}
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
              <Label data={data} />
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
            position={data.handlePositions[id]}
            label={label}
            boxStyle={boxStyle}
          />
        ))}
        {_.map(
          _.difference(_.values(Position), _.values(data.handlePositions)),
          (position, index) => (
            <DropZone key={index} nodeId={id} position={position} />
          ),
        )}
      </div>
      <NodeModal
        id={id}
        data={data}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}
