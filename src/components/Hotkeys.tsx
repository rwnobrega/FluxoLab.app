import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import actions from "~/core/actions";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreMachine from "~/store/useStoreMachine";

export default function (): JSX.Element {
  const { refInput } = useStoreEphemeral();
  const { machineState, executeAction } = useStoreMachine();

  for (const { actionId, hotkey, enabledStatuses } of actions) {
    useHotkeys(
      hotkey,
      () => {
        if (hotkey === "F8") {
          refInput.current?.focus();
        }
        if (enabledStatuses.includes(machineState.status)) {
          executeAction(actionId);
        }
      },
      {
        enableOnFormTags: ["INPUT", "TEXTAREA"],
        preventDefault: true,
      },
    );
  }

  // useHotkeys("ctrl+a", selectAll);  // TODO: Implement selectAll

  return <></>;
}
