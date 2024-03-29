import { CompileError } from "machine/compiler";
import { MachineState } from "machine/machine";

import { Action } from "stores/useStoreMachineState";

interface PlayButton {
  action: Action;
  hotkey: string;
  description: string;
  icon: string;
  isDisabled: (state: MachineState, compileErrors: CompileError[]) => boolean;
}

function isDisabledBackward(state: MachineState): boolean {
  return state.status === "ready" && state.timeSlot === -1;
}

function isDisabledForward(state: MachineState): boolean {
  return state.status === "error" || state.status === "halted";
}

const buttonList: PlayButton[] = [
  {
    action: "reset",
    hotkey: "F6",
    description: "PlayButton_Reset",
    icon: "bi-stop-fill",
    isDisabled: (state, compileErrors) =>
      compileErrors.length > 0 || isDisabledBackward(state),
  },
  {
    action: "stepBack",
    hotkey: "F7",
    description: "PlayButton_StepBack",
    icon: "bi-skip-start-fill",
    isDisabled: (state, compileErrors) =>
      compileErrors.length > 0 || isDisabledBackward(state),
  },
  {
    action: "nextStep",
    hotkey: "F8",
    description: "PlayButton_NextStep",
    icon: "bi-skip-end-fill",
    isDisabled: (state, compileErrors) =>
      compileErrors.length > 0 ||
      isDisabledForward(state) ||
      state.status === "waiting",
  },
];

export default buttonList;
