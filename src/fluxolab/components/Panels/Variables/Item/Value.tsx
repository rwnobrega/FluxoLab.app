import React from "react";

import { Props } from ".";

import { getVariableType } from "machine/variables";

import useStoreMachineState from "stores/useStoreMachineState";

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
