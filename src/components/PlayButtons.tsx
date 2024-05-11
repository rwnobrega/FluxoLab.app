import _ from "lodash";
import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import Tooltip from "~/components/General/Tooltip";
import actions, { Action } from "~/core/actions";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";

export default function (): JSX.Element {
  const { machineState, executeAction } = useStoreMachine();
  const { getString } = useStoreStrings();

  const onClick = (actionId: Action["actionId"]): void => {
    executeAction(actionId);
  };

  return (
    <ButtonGroup style={{ zIndex: 10 }}>
      {_.map(
        actions,
        ({ actionId, description, hotkey, icon, enabledStatuses }) => {
          const disabled = !enabledStatuses.includes(machineState.status);
          const tooltipText = disabled
            ? ""
            : `${getString(description)} (${hotkey})`;
          return (
            <Tooltip key={actionId} text={tooltipText}>
              <Button disabled={disabled} onClick={() => onClick(actionId)}>
                <i className={`bi ${icon}`} />
              </Button>
            </Tooltip>
          );
        },
      )}
    </ButtonGroup>
  );
}
