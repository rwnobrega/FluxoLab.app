import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";

import ChatBubble from "./ChatBubble";

export default function (): JSX.Element {
  const refInput = useRef<HTMLInputElement>(null);
  const refStackEnd = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");

  const { setRefInput } = useStoreEphemeral();
  const { machineState, executeAction } = useStoreMachine();
  const { getString } = useStoreStrings();

  useEffect(() => {
    setRefInput(refInput);
  }, [refInput]);

  const handleSendInput = () => {
    const inputTextTrimmed = inputText.trim();
    if (inputTextTrimmed.length > 0) {
      machineState.input = inputTextTrimmed;
      executeAction("nextStep");
      setInputText("");
    }
  };

  useEffect(() => {
    if (machineState.status === "waiting") {
      refInput.current?.focus();
    }
  }, [machineState.status]);

  useEffect(() => {
    if (refStackEnd.current != null) {
      refStackEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [machineState.status, machineState.interaction]);

  return (
    <div className="d-flex flex-column h-100">
      <p className="fw-semibold">{getString("Interaction_Title")}</p>
      <Stack
        gap={2}
        className="mb-3"
        style={{ overflowY: "auto", overflowX: "clip" }}
      >
        {_.map(machineState.interaction, ({ direction, text }, index) => (
          <ChatBubble key={index} direction={direction} text={text} />
        ))}
        <div ref={refStackEnd} />
      </Stack>
      <Form.Control
        ref={refInput}
        size="sm"
        value={inputText}
        disabled={machineState.status !== "waiting"}
        onChange={(event) => setInputText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSendInput();
          }
        }}
      />
    </div>
  );
}
