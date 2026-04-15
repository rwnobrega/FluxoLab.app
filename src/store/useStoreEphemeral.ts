import { RefObject, createRef } from "react";
import { create } from "zustand";

interface PanelImperativeApi {
  collapse: () => void;
  expand: () => void;
  getSize: () => number;
  isCollapsed: () => boolean;
  isExpanded: () => boolean;
  resize: (size: number | string) => void;
}

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
  connectionSourceHandle: string | null;
  setConnectionSourceHandle: (connectionSourceHandle: string | null) => void;
  mouseOverNodeId: string | null;
  setMouseOverNodeId: (id: string | null) => void;
  toasts: ToastContent[];
  triggerToast: (content: ToastContent) => void;
  refInput: React.RefObject<HTMLInputElement>;
  setRefInput: (ref: React.RefObject<HTMLInputElement>) => void;
  // Painel Esquerdo - Gerenciamento de Estado e Ref
  leftPanelVisible: boolean;
  setLeftPanelVisible: (visible: boolean) => void;
  leftPanelRef: RefObject<PanelImperativeApi>;
  toggleLeftPanel: () => void;
}

const useStoreEphemeral = create<StoreEphemeral>()((set, get) => ({
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
    set({ toasts: [...get().toasts, content] });
    setTimeout(() => set({ toasts: get().toasts.slice(1) }), 5000);
  },
  refInput: { current: null },
  setRefInput: (ref) => set({ refInput: ref }),
  // Implementação do Painel
  leftPanelVisible: true,
  leftPanelRef: createRef<PanelImperativeApi>(),
  setLeftPanelVisible: (visible) => set({ leftPanelVisible: visible }),

  toggleLeftPanel: () => {
    const panel = get().leftPanelRef.current;
    if (panel) {
      if (panel.isCollapsed()) {
        panel.expand();
      } else {
        panel.collapse();
      }
    }
  },
}));

export default useStoreEphemeral;
