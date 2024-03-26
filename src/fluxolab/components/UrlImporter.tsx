import React, { useEffect } from "react";

import { deserialize } from "stores/serialize";
import useStoreFlow from "stores/useStoreFlow";
import useStoreMachine from "stores/useStoreMachine";
import useStoreEphemeral from "stores/useStoreEphemeral";
import useStoreStrings from "stores/useStoreStrings";

export default function UrlImporter(): JSX.Element {
  const { clearAll, setNodes, makeConnections } = useStoreFlow();
  const { setTitle, setVariables } = useStoreMachine();
  const { triggerToast } = useStoreEphemeral();
  const { getString } = useStoreStrings();

  useEffect(() => {
    const url = new URL(window.location.href);
    const lzs = url.searchParams.get("lzs");
    if (lzs !== null) {
      try {
        const { nodes, edges, variables, title } = deserialize(lzs);
        clearAll();
        setNodes(nodes);
        makeConnections(edges);
        setVariables(variables);
        setTitle(title);
        url.searchParams.delete("lzs");
        window.history.replaceState({}, "", url.toString());
        triggerToast({
          message: getString("ToastMessage_ImportSuccess"),
          icon: "bi-check-circle",
          background: "success",
        });
      } catch {
        triggerToast({
          message: getString("ToastMessage_ImportError"),
          icon: "bi-exclamation-triangle",
          background: "danger",
        });
      }
    }
  }, []);

  return <></>;
}
