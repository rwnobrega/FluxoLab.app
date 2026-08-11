import { RefObject } from "react";
import { create } from "zustand";

interface ToastContent {
  message: string;
  icon: string;
  background: string;
}

interface Toast extends ToastContent {
  id: number;
  duration: number;
}

export type RightTab = "workspace" | "trace";

interface StoreEphemeral {
  // Which tab of the right panel is showing. Interface state, but it lives
  // here instead of in `App` because the flowchart reads it too: the block
  // numbers are drawn only while the desk-check is on screen.
  rightTab: RightTab;
  setRightTab: (rightTab: RightTab) => void;
  isDraggingNode: boolean;
  setIsDraggingNode: (isDraggingNode: boolean) => void;
  connectionSource: string | null;
  setConnectionSource: (connectionSource: string | null) => void;
  connectionSourceHandle: string | null;
  setConnectionSourceHandle: (connectionSourceHandle: string | null) => void;
  mouseOverNodeId: string | null;
  setMouseOverNodeId: (id: string | null) => void;
  toasts: Toast[];
  triggerToast: (content: ToastContent) => void;
  removeToast: (id: number) => void;
  refInput: RefObject<HTMLInputElement>;
  setRefInput: (ref: RefObject<HTMLInputElement>) => void;
}

let toastIdCounter = 0;

const useStoreEphemeral = create<StoreEphemeral>()((set, get) => ({
  rightTab: "workspace",
  setRightTab: (rightTab) => set({ rightTab }),
  isDraggingNode: false,
  setIsDraggingNode: (isDraggingNode) => set({ isDraggingNode }),
  connectionSource: null,
  setConnectionSource: (connectionSource) => set({ connectionSource }),
  connectionSourceHandle: null,
  setConnectionSourceHandle: (connectionSourceHandle) =>
    set({ connectionSourceHandle }),
  mouseOverNodeId: null,
  setMouseOverNodeId: (id) => set({ mouseOverNodeId: id }),
  toasts: [],
  triggerToast: (content) => {
    const id = toastIdCounter++;
    const duration = 5000;
    set({ toasts: [...get().toasts, { ...content, id, duration }] });
    setTimeout(() => get().removeToast(id), duration);
  },
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) });
  },
  refInput: { current: null },
  setRefInput: (ref) => set({ refInput: ref }),
}));

export default useStoreEphemeral;
