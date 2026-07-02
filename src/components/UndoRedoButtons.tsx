import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import Tooltip from "~/components/General/Tooltip";
import useStoreHistory from "~/store/useStoreHistory";
import useStoreStrings from "~/store/useStoreStrings";

export default function (): JSX.Element {
  const { history, future, undo, redo } = useStoreHistory();
  const { getString } = useStoreStrings();

  const canUndo = history.length > 0;
  const canRedo = future.length > 0;

  return (
    <ButtonGroup style={{ zIndex: 10 }}>
      <Tooltip text={canUndo ? `${getString("UndoRedo_Undo")} (Ctrl+Z)` : ""}>
        <Button variant="secondary" disabled={!canUndo} onClick={undo}>
          <i className="bi bi-arrow-counterclockwise" />
        </Button>
      </Tooltip>
      <Tooltip text={canRedo ? `${getString("UndoRedo_Redo")} (Ctrl+Y)` : ""}>
        <Button variant="secondary" disabled={!canRedo} onClick={redo}>
          <i className="bi bi-arrow-clockwise" />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
}
