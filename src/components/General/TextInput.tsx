import React from "react";
import Form from "react-bootstrap/Form";

import Markdown from "~/components/General/Markdown";

interface Props {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  problem: string;
}

export default function ({
  placeholder,
  value,
  setValue,
  problem = "",
}: Props): JSX.Element {
  return (
    <>
      <Form.Control
        type="text"
        className={`font-monospace ${problem === "" ? "" : "is-invalid"}`}
        autoFocus
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={(event) => event.target.select()}
      />
      <Markdown
        className="pt-2 small text-danger"
        source={problem === "" ? "\u00A0" : problem}
      />
    </>
  );
}
