import _ from "lodash";

import { Block } from "./blocks";
import { VarType, Variable } from "./variables";

export interface Machine {
  title: string;
  flowchart: Block[];
  startBlockId: string;
  variables: Variable[];
}

export interface MachineState {
  curBlockId: string | null;
  timeSlot: number;
  memory: Record<string, VarType | null>;
  input: string | null;
  interaction: Array<{ direction: "in" | "out"; text: string }>;
  status: "ready" | "waiting" | "halted" | "error";
  error: { message: string; payload?: Record<string, string> } | null;
}

export function runMachineStep(machine: Machine, state: MachineState): void {
  if (state.curBlockId === null) {
    state.curBlockId = machine.startBlockId;
  }
  const block = _.find(machine.flowchart, { id: state.curBlockId }) as Block;
  block.work(machine, state);
  const nextBlock = _.find(machine.flowchart, {
    id: state.curBlockId,
  }) as Block;
  if (nextBlock.type === "halt") {
    state.status = "halted";
    return;
  }
  if (nextBlock.type === "input" && state.status !== "error") {
    state.status = "waiting";
  }
  state.timeSlot += 1;
}

export function getInitialState(variables: Variable[]): MachineState {
  return {
    curBlockId: null,
    timeSlot: -1,
    memory: _.fromPairs(variables.map((variable) => [variable.id, null])),
    input: null,
    interaction: [],
    error: null,
    status: "ready",
  };
}
