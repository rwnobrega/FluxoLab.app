import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useReactFlow } from "reactflow";

import actions from "~/core/actions";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreClipboard from "~/store/useStoreClipboard";
import useStoreFlowchart from "~/store/useStoreFlowchart";

export default function (): JSX.Element {
  const { refInput } = useStoreEphemeral();
  const { machineState, executeAction } = useStoreMachine();
  const { copyNodes, pasteNodes, cutNodes, selectAll } = useStoreClipboard();
  const { undo, redo } = useStoreFlowchart((s) => ({ undo: s.undo, redo: s.redo }));
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

  useHotkeys("ctrl+z, meta+z", () => undo(), {
    preventDefault: true,
  });

  useHotkeys("ctrl+y, ctrl+shift+z, meta+y, meta+shift+z", () => redo(), {
    preventDefault: true,
  });

  useHotkeys("ctrl+a, meta+a", () => selectAll(), {
    preventDefault: true,
  });
  return <></>;
}
