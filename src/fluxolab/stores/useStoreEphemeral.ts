import { create } from 'zustand'

interface ToastContent {
  message: string
  icon: string
  background: string
}

interface StoreEphemeral {
  isDraggingNode: boolean
  setIsDraggingNode: (isDraggingNode: boolean) => void
  isConnectingEdge: boolean
  setIsConnectingEdge: (isConnectingEdge: boolean) => void
  mouseOverNodeId: string | null
  setMouseOverNodeId: (id: string | null) => void
  toastContent: ToastContent | null
  setToastContent: (content: ToastContent | null) => void
  refInput: React.RefObject<HTMLInputElement>
  setRefInput: (ref: React.RefObject<HTMLInputElement>) => void
}

const useStoreEphemeral = create<StoreEphemeral>()(
  (set, get) => ({
    isDraggingNode: false,
    setIsDraggingNode: isDraggingNode => set({ isDraggingNode }),
    isConnectingEdge: false,
    setIsConnectingEdge: isConnectingEdge => set({ isConnectingEdge }),
    mouseOverNodeId: null,
    setMouseOverNodeId: id => set({ mouseOverNodeId: id }),
    toastContent: null,
    setToastContent: content => set({ toastContent: content }),
    refInput: { current: null },
    setRefInput: ref => set({ refInput: ref })
  })
)

export default useStoreEphemeral
