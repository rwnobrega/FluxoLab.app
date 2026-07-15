import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import _ from "lodash";
import React from "react";
import Table from "react-bootstrap/Table";

import useStoreFlowchart from "~/store/useStoreFlowchart";

import VariableItem from "./Item";

export default function (): JSX.Element {
  const { flowchart, reorderVariables } = useStoreFlowchart();

  const onDragStart = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  const onDragEnd = ({ source, destination }: any) => {
    reorderVariables(source.index, destination?.index);
  };

  return (
    <div className="d-flex flex-column h-100">
      <div style={{ overflowY: "auto", overflowX: "clip" }}>
        <Table size="sm" variant="borderless" className="mb-0">
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {({ innerRef, droppableProps, placeholder }) => (
                <tbody ref={innerRef} {...droppableProps}>
                  {_.map(flowchart.variables, ({ id }, idx) => (
                    <Draggable key={idx} draggableId={`${idx}`} index={idx}>
                      {({ innerRef, draggableProps, dragHandleProps }) => (
                        <tr
                          ref={innerRef}
                          {...draggableProps}
                          {...dragHandleProps}
                        >
                          <VariableItem id={id} />
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {placeholder}
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </div>
    </div>
  );
}
