import { create } from 'zustand'

interface StoreEphemeral {
  mouseOverNodeId: string | null
  setMouseOverNodeId: (id: string | null) => void
  copyLinkToast: boolean
  setCopyLinkToast: (show: boolean) => void
}

const useStoreEphemeral = create<StoreEphemeral>()(
  (set, get) => ({
    mouseOverNodeId: null,
    setMouseOverNodeId: id => set({ mouseOverNodeId: id }),
    copyLinkToast: false,
    setCopyLinkToast: show => set({ copyLinkToast: show })
  })
)

export default useStoreEphemeral
