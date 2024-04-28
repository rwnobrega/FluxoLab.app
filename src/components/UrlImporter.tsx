import React, { useEffect } from "react";

import { deserialize } from "~/store/serialize";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreFlowchart from "~/store/useStoreFlowchart";
import useStoreStrings from "~/store/useStoreStrings";

export default function UrlImporter(): JSX.Element {
  const { importSimpleFlowchart } = useStoreFlowchart();
  const { triggerToast } = useStoreEphemeral();
  const { getString } = useStoreStrings();

  useEffect(() => {
    const url = new URL(window.location.href);
    const lzs = url.searchParams.get("lzs");
    if (lzs !== null) {
      try {
        const simpleFlowchart = deserialize(lzs);
        importSimpleFlowchart(simpleFlowchart);
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
