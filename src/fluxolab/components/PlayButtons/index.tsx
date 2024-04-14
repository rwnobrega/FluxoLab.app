import _ from "lodash";

import React from "react";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

import Tooltip from "components/General/Tooltip";

import useStoreMachine from "stores/useStoreMachine";
import useStoreMachineState, { Action } from "stores/useStoreMachineState";
import useStoreStrings from "stores/useStoreStrings";

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
