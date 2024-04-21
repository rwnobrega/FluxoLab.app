import _ from "lodash";
import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import useStoreEphemeral from "~/store/useStoreEphemeral";

export default function (): JSX.Element {
  const { toasts } = useStoreEphemeral();

  return (
    <ToastContainer className="position-fixed bottom-0 end-0 m-3">
      {_.map(toasts, (toast, index) => (
        <Toast key={index} bg={toast.background} className="text-white">
          <Toast.Body>
            <i className={`bi ${toast.icon} me-2`} /> {toast.message}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}
