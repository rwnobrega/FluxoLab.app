import _ from "lodash";
import { create } from "zustand";

import { Action } from "~/core/actions";
import check from "~/core/check";
import { DataType } from "~/core/dataTypes";
import execute, { refreshStatus } from "~/core/execute";
import assert from "~/utils/assert";
import minstd from "~/utils/minstd";

import { Flowchart } from "./useStoreFlowchart";

type MachineMemory = Record<string, { type: DataType; value: any | null }>;

interface InteractionAtom {
  direction: "in" | "out";
  text: string;
}

export interface MachineError {
  type: "syntax" | "check" | "runtime";
  message: string;
  nodeId: string | null;
  payload?: Record<string, any>;
}

export interface MachineState {
  curNodeId: string | null;
  timeSlot: number;
  memory: MachineMemory;
  // Tokens typed but not yet read, oldest first. A read takes one per variable
  // and leaves the rest queued, so input can be given a line at a time, all at
  // once before the run, or anywhere in between.
  inputBuffer: string[];
  outPort: string | null;
  rand: number;
  interaction: InteractionAtom[];
  status:
    | "ready" // Ready to run (timeSlot = 0)
    | "running" // Running (timeSlot > 0)
    | "waiting" // Waiting for user input
    | "halted" // Execution has halted
    | "exception" // Runtime exception
    | "invalid"; // Failed to compile (check errors)
  errors: MachineError[];
}

interface StoreMachine {
  flowchart: Flowchart | null;
  machineState: MachineState;
  stateHistory: MachineState[];
  seed: number;
  resetMachine: (flowchart: Flowchart) => void;
  executeAction: (actionId: Action["actionId"]) => void;
  sendInput: (text: string) => void;
  clearInput: () => void;
}

const getEmptyMachineState = (): MachineState => ({
  curNodeId: null,
  timeSlot: 0,
  memory: {},
  inputBuffer: [],
  outPort: null,
  rand: 0,
  interaction: [],
  status: "invalid",
  errors: [],
});

const useStoreMachine = create<StoreMachine>()((set, get) => ({
  flowchart: null,
  seed: minstd.getNext(Math.floor(Date.now())), // Unix timestamp
  machineState: getEmptyMachineState(),
  stateHistory: [],
  resetMachine: (flowchart) => {
    const machineState = getEmptyMachineState();
    const checkErrors = check(flowchart);
    machineState.status = checkErrors.length > 0 ? "invalid" : "ready";
    machineState.errors = checkErrors;
    machineState.memory = {};
    for (const { id, type } of flowchart.variables) {
      machineState.memory[id] = { type, value: null };
    }
    machineState.rand = get().seed;
    // Clear the execution history: a reset starts a fresh run, so no state
    // from a previous run should linger (this also keeps the desk-check table
    // scoped to the current run).
    set({ machineState, flowchart, stateHistory: [] });
  },
  executeAction: (actionId) => {
    const { flowchart, stateHistory, machineState, resetMachine } = get();
    assert(flowchart !== null);
    switch (actionId) {
      case "reset": {
        resetMachine(flowchart);
        break;
      }
      case "stepBack": {
        const lastState = stateHistory.pop();
        set({ machineState: lastState, stateHistory });
        break;
      }
      case "nextStep": {
        stateHistory.push(machineState);
        const nextState = execute(flowchart, machineState);
        set({ machineState: nextState, stateHistory });
        break;
      }
    }
  },
  sendInput: (text) => {
    const { flowchart, machineState } = get();
    assert(flowchart !== null);
    const tokens = _.filter(_.split(text, /\s+/), (token) => token.length > 0);
    if (tokens.length === 0) return;
    // A machine that has halted, failed or does not compile has nothing to
    // read: queuing tokens for it would only leave them stranded.
    const accepting = ["ready", "running", "waiting"];
    if (!accepting.includes(machineState.status)) return;
    const wasWaiting = machineState.status === "waiting";
    const state = refreshStatus(flowchart, {
      ...machineState,
      inputBuffer: [...machineState.inputBuffer, ...tokens],
    });
    set({ machineState: state });
    // Answering a machine that was blocked also takes the step it was blocked
    // on, so that typing a line and pressing Enter still reads it -- the
    // gesture from before the queue existed. Tokens typed ahead of a read that
    // is not yet under the highlight only wait in the queue: what advances the
    // machine then is the step button, as for every other block.
    if (wasWaiting && state.status === "running") {
      get().executeAction("nextStep");
    }
  },
  clearInput: () => {
    const { flowchart, machineState } = get();
    assert(flowchart !== null);
    // Emptying the queue is the way back from a mistyped line: without it, a
    // token typed by accident could only be got rid of by restarting the run.
    set({
      machineState: refreshStatus(flowchart, {
        ...machineState,
        inputBuffer: [],
      }),
    });
  },
}));

export default useStoreMachine;
