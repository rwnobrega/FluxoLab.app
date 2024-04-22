import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import buttonList from "~/components/PlayButtons/buttonList";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlow from "~/store/useStoreFlow";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreMachineState from "~/store/useStoreMachineState";

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
        preventDefault: true,
      },
    );
  }

  useHotkeys("ctrl+a", selectAll);

  return <></>;
}
