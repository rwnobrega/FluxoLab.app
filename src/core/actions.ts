import { MachineState } from "~/store/useStoreMachine";

export interface Action {
  actionId: "reset" | "stepBack" | "nextStep";
  hotkey: string;
  description: string;
  icon: string;
  enabledStatuses: Array<MachineState["status"]>;
}

const actions: Action[] = [
  {
    actionId: "reset",
    hotkey: "F6",
    description: "PlayButton_Reset",
    icon: "bi-arrow-clockwise",
    enabledStatuses: ["exception", "halted", "running", "waiting"],
  },
  {
    actionId: "stepBack",
    hotkey: "F7",
    description: "PlayButton_StepBack",
    icon: "bi-skip-start-fill",
    enabledStatuses: ["exception", "halted", "running", "waiting"],
  },
  {
    actionId: "nextStep",
    hotkey: "F8",
    description: "PlayButton_NextStep",
    icon: "bi-skip-end-fill",
    enabledStatuses: ["ready", "running"],
  },
];

export default actions;
