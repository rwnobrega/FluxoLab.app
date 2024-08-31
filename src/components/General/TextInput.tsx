import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Markdown from "~/components/General/Markdown";

import Tooltip from "./Tooltip";

interface Props {
  helpText: string;
  value: string;
  setValue: (value: string) => void;
  problem: string;
}

export default function ({
  helpText,
  value,
  setValue,
  problem = "",
}: Props): JSX.Element {
  return (
    <>
      <InputGroup>
        <Form.Control
          type="text"
          className={`font-monospace ${problem === "" ? "" : "is-invalid"}`}
          autoFocus
          autoComplete="off"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={(event) => event.target.select()}
        />
        <Tooltip text={helpText}>
          <InputGroup.Text>
            <i className="bi bi-question-circle" />
          </InputGroup.Text>
        </Tooltip>
      </InputGroup>
      <Markdown
        className="pt-2 small text-danger"
        source={problem === "" ? "\u00A0" : problem}
      />
    </>
  );
}
