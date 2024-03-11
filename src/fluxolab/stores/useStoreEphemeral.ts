import { create } from 'zustand'

interface StoreEphemeral {
  mouseOverNodeId: string | null
  setMouseOverNodeId: (id: string | null) => void
}

const useStoreEphemeral = create<StoreEphemeral>()(
  (set, get) => ({
    mouseOverNodeId: null,
    setMouseOverNodeId: id => set({ mouseOverNodeId: id })
  })
)

export default useStoreEphemeral
