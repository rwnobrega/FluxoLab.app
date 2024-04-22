import React from "react";

import { getVariableType } from "~/core/machine/variables";
import useStoreMachineState from "~/store/useStoreMachineState";

import { Props } from ".";

const classes = [
  "d-flex",
  "p-1",
  "fw-semibold font-monospace",
  "text-success bg-success",
  "bg-opacity-10",
  "border border-success border-opacity-10 rounded-1",
].join(" ");

export default function ({ id, type }: Props): JSX.Element {
  const { getState } = useStoreMachineState();
  const state = getState();
  const value = state.memory[id];
  const variableType = getVariableType(type);
  const content =
    value === null || value === undefined
      ? "?"
      : variableType.valueToString(value);
  return <small className={classes}>{content}</small>;
}
