import _ from "lodash";
import { create } from "zustand";

import { Action } from "~/core/actions";
import { DataType } from "~/core/dataTypes";
import check from "~/core/machine/check";
import execute from "~/core/machine/execute";
import assert from "~/utils/assert";
import minstd from "~/utils/minstd";

import { Flowchart } from "./useStoreFlowchart";

export type MachineMemory = Record<
  string,
  { type: DataType; value: any | null }
>;

export interface InteractionAtom {
  direction: "in" | "out";
  text: string;
}

export interface MachineError {
  type: "syntax" | "check" | "runtime";
  message: string;
  nodeId: string | null;
  payload?: Record<
    string,
    string | number | boolean | Array<string | number | boolean>
  >;
}

export interface MachineState {
  curNodeId: string | null;
  timeSlot: number;
  memory: MachineMemory;
  input: string | null;
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
}

const getEmptyMachineState = (): MachineState => ({
  curNodeId: null,
  timeSlot: 0,
  memory: {},
  input: null,
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
    set({ machineState, flowchart });
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
}));

export default useStoreMachine;
