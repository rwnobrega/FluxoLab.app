import _ from "lodash";
import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import useStoreEphemeral from "~/store/useStoreEphemeral";

const timerStyles = `
@keyframes toast-timer-shrink {
  from { width: 100%; }
  to { width: 0%; }
}
.toast-timer {
  height: 3px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  animation: toast-timer-shrink linear forwards;
}
`;

export default function (): JSX.Element {
  const { toasts, removeToast } = useStoreEphemeral();

  return (
    <>
      <style>{timerStyles}</style>
      <ToastContainer className="position-fixed bottom-0 end-0 m-3">
        {_.map(toasts, (toast) => (
          <Toast
            key={toast.id}
            bg={toast.background}
            className="text-white overflow-hidden"
            onClose={() => removeToast(toast.id)}
          >
            <Toast.Body className="d-flex align-items-center">
              <i className={`bi ${toast.icon} me-2`} />
              <span className="flex-grow-1">{toast.message}</span>
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                aria-label="Fechar"
                onClick={() => removeToast(toast.id)}
              />
            </Toast.Body>
            <div
              className="toast-timer"
              style={{ animationDuration: `${toast.duration}ms` }}
            />
          </Toast>
        ))}
      </ToastContainer>
    </>
  );
}
