import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

import InputQueue from "~/components/InputQueue";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreMachine from "~/store/useStoreMachine";
import useStoreStrings from "~/store/useStoreStrings";

import ChatBubble from "./ChatBubble";

export default function (): JSX.Element {
  const refInput = useRef<HTMLInputElement>(null);
  const refStackEnd = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");

  const { setRefInput } = useStoreEphemeral();
  const { machineState, sendInput } = useStoreMachine();
  const { getString } = useStoreStrings();

  useEffect(() => {
    setRefInput(refInput);
  }, [refInput]);

  // The field is open whenever the machine can still read, not only while it
  // is blocked: input given ahead of time waits in the queue, which is what
  // lets a whole run be typed in one go.
  const isAccepting = ["ready", "running", "waiting"].includes(
    machineState.status,
  );

  const handleSendInput = () => {
    const inputTextTrimmed = inputText.trim();
    if (inputTextTrimmed.length > 0) {
      sendInput(inputTextTrimmed);
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
      <InputQueue />
      <Form.Control
        ref={refInput}
        size="sm"
        value={inputText}
        placeholder={getString("Interaction_Placeholder")}
        disabled={!isAccepting}
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
