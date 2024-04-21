import _ from "lodash";
import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import Tooltip from "~/components/General/Tooltip";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreMachineState, { Action } from "~/store/useStoreMachineState";
import useStoreStrings from "~/store/useStoreStrings";

import buttonList from "./buttonList";

export default function (): JSX.Element {
  const { machine, compileErrors } = useStoreMachine();
  const { getState, execAction } = useStoreMachineState();
  const { getString } = useStoreStrings();

  const state = getState();

  const onClick = (action: Action): void => {
    execAction(action, machine);
  };

  return (
    <ButtonGroup style={{ zIndex: 10 }}>
      {_.map(
        buttonList,
        ({ action, description, hotkey, icon, isDisabled }) => {
          const disabled = isDisabled(state, compileErrors);
          const tooltipText = disabled
            ? ""
            : `${getString(description)} (${hotkey})`;
          return (
            <Tooltip key={action} text={tooltipText}>
              <Button disabled={disabled} onClick={() => onClick(action)}>
                <i className={`bi ${icon}`} />
              </Button>
            </Tooltip>
          );
        },
      )}
    </ButtonGroup>
  );
}
