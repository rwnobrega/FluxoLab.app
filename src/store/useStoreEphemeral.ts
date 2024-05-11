import { create } from "zustand";

interface ToastContent {
  message: string;
  icon: string;
  background: string;
}

interface StoreEphemeral {
  isDraggingNode: boolean;
  setIsDraggingNode: (isDraggingNode: boolean) => void;
  connectionSource: string | null;
  setConnectionSource: (connectionSource: string | null) => void;
  mouseOverNodeId: string | null;
  setMouseOverNodeId: (id: string | null) => void;
  isEditingHandles: boolean;
  setIsEditingHandles: (isEditingHandles: boolean) => void;
  toasts: ToastContent[];
  triggerToast: (content: ToastContent) => void;
  refInput: React.RefObject<HTMLInputElement>;
  setRefInput: (ref: React.RefObject<HTMLInputElement>) => void;
}

const useStoreEphemeral = create<StoreEphemeral>()((set, get) => ({
  isDraggingNode: false,
  setIsDraggingNode: (isDraggingNode) => set({ isDraggingNode }),
  connectionSource: null,
  setConnectionSource: (connectionSource) => set({ connectionSource }),
  mouseOverNodeId: null,
  setMouseOverNodeId: (id) => set({ mouseOverNodeId: id }),
  isEditingHandles: false,
  setIsEditingHandles: (isEditingHandles) => set({ isEditingHandles }),
  toasts: [],
  triggerToast: (content) => {
    set({ toasts: [...get().toasts, content] });
    setTimeout(() => set({ toasts: get().toasts.slice(1) }), 5000);
  },
  refInput: { current: null },
  setRefInput: (ref) => set({ refInput: ref }),
}));

export default useStoreEphemeral;
