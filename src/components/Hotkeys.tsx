import _ from "lodash";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useReactFlow } from "reactflow";

import actions from "~/core/actions";
import useStoreClipboard from "~/store/useStoreClipboard";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreMachine from "~/store/useStoreMachine";
import { redo, undo } from "~/store/useStoreHistory";

export default function (): JSX.Element {
  const { refInput } = useStoreEphemeral();
  const { machineState, executeAction } = useStoreMachine();
  const { copyNodes, pasteNodes, cutNodes } = useStoreClipboard();
  const { getNodes, setNodes } = useReactFlow();

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
      { preventDefault: true, enableOnFormTags: ["INPUT", "TEXTAREA"] },
    );
  }

  // Copy
  useHotkeys(
    "ctrl+c, meta+c",
    () => {
      const ids = _.map(_.filter(getNodes(), "selected"), "id");
      copyNodes(ids);
    },
    { preventDefault: true },
  );

  // Paste
  useHotkeys(
    "ctrl+v, meta+v",
    () => {
      pasteNodes();
    },
    { preventDefault: true },
  );

  // Cut
  useHotkeys(
    "ctrl+x, meta+x",
    () => {
      const ids = _.map(_.filter(getNodes(), "selected"), "id");
      cutNodes(ids);
    },
    { preventDefault: true },
  );

  // Select all
  useHotkeys(
    "ctrl+a, meta+a",
    () => {
      const nodes = _.map(getNodes(), (node) => ({ ...node, selected: true }));
      setNodes(nodes);
    },
    { preventDefault: true },
  );

  // Select none
  useHotkeys(
    "esc",
    () => {
      const nodes = _.map(getNodes(), (node) => ({ ...node, selected: false }));
      setNodes(nodes);
    },
    { preventDefault: true },
  );

  // Undo
  useHotkeys("ctrl+z, meta+z", () => undo(), {
      preventDefault: true,
  });

  // Redo
  useHotkeys("ctrl+y, ctrl+shift+z, meta+y, meta+shift+z", () => redo(), {
      preventDefault: true,
  });

  return <></>;
}
