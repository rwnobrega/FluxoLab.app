import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useReactFlow } from "reactflow";

import actions from "~/core/actions";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreClipboard from "~/store/useStoreClipboard";

export default function (): JSX.Element {
  const { refInput } = useStoreEphemeral();
  const { machineState, executeAction } = useStoreMachine();
  const { copyNodes, pasteNodes, cutNodes } = useStoreClipboard();
  const { getNodes } = useReactFlow();

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

  const getSelectedIds = () =>
    getNodes()
      .filter((n) => n.selected)
      .map((n) => n.id);

  useHotkeys("ctrl+c, meta+c", () => copyNodes(getSelectedIds()), {
    preventDefault: true,
  });

  useHotkeys("ctrl+v, meta+v", () => pasteNodes(), {
    preventDefault: true,
  });

  useHotkeys("ctrl+x, meta+x", () => cutNodes(getSelectedIds()), {
    preventDefault: true,
  });

  // useHotkeys("ctrl+a", selectAll);  // TODO: Implement selectAll
  return <></>;
}
