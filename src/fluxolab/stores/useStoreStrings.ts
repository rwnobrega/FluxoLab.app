import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import stringsJson from 'assets/strings.json'

const strings: Record<string, Record<string, string>> = stringsJson

interface StoreStrings {
  language: string
  setLanguage: (language: string) => void
  getString: (key: string) => string
}

const useStoreStrings = create<StoreStrings>()(
  persist(
    (set, get) => ({
      language: navigator.language,
      setLanguage: language => set({ language }),
      getString: key => strings[get().language][key] ?? strings.en[key] ?? key
    })
    ,
    {
      name: 'fluxolab_strings',
      version: 5
    }
  )
)

export default useStoreStrings
