import { create } from 'zustand'

interface ToastContent {
  message: string
  icon: string
}

interface StoreEphemeral {
  mouseOverNodeId: string | null
  setMouseOverNodeId: (id: string | null) => void
  toastContent: ToastContent | null
  setToastContent: (content: ToastContent | null) => void
}

const useStoreEphemeral = create<StoreEphemeral>()(
  (set, get) => ({
    mouseOverNodeId: null,
    setMouseOverNodeId: id => set({ mouseOverNodeId: id }),
    toastContent: null,
    setToastContent: content => set({ toastContent: content })
  })
)

export default useStoreEphemeral
