import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import stringsJson from 'assets/strings.json'

const strings: Record<string, Record<string, string>> = stringsJson

interface StoreStrings {
  language: string
  setLanguage: (language: string) => void
  getString: (key: string, replacements?: Record<string, string>) => string
}

const useStoreStrings = create<StoreStrings>()(
  persist(
    (set, get) => ({
      language: navigator.language,
      setLanguage: language => set({ language }),
      getString: (key, replacements = {}) => {
        let string = strings[get().language][key] ?? strings.en[key] ?? key
        for (const [key, value] of Object.entries(replacements)) {
          string = string.replace(new RegExp(`{{${key}}}`, 'g'), value)
        }
        return string
      }
    })
    ,
    {
      name: 'fluxolab_strings',
      version: 5
    }
  )
)

export default useStoreStrings
