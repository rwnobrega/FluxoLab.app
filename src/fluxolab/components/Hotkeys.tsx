import React from "react";

import { useHotkeys } from "react-hotkeys-hook";

import useStoreFlow from "stores/useStoreFlow";
import useStoreMachineState from "stores/useStoreMachineState";
import useStoreMachine from "stores/useStoreMachine";
import useStoreEphemeral from "stores/useStoreEphemeral";

import buttonList from "components/PlayButtons/buttonList";

export default function (): JSX.Element {
  const { selectAll } = useStoreFlow();
  const { execAction, getState } = useStoreMachineState();
  const { machine, compileErrors } = useStoreMachine();
  const { refInput } = useStoreEphemeral();

  const state = getState();

  for (const { action, hotkey, isDisabled } of buttonList) {
    useHotkeys(
      hotkey,
      () => {
        if (hotkey === "F8") {
          refInput.current?.focus();
        }
        if (!isDisabled(state, compileErrors)) {
          execAction(action, machine);
        }
      },
      {
        enableOnFormTags: ["INPUT", "TEXTAREA"],
      },
    );
  }

  useHotkeys("ctrl+a", selectAll);

  return <></>;
}
