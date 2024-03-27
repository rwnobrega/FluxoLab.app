import _ from "lodash";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import stringsJson from "assets/strings.json";

const strings: Record<string, Record<string, string>> = stringsJson;

interface StoreStrings {
  language: string;
  setLanguage: (language: string) => void;
  getString: (key: string, replacements?: Record<string, string>) => string;
}

const useStoreStrings = create<StoreStrings>()(
  persist(
    (set, get) => ({
      language: navigator.language,
      setLanguage: (language) => set({ language }),
      getString: (key, replacements = {}) => {
        let string = strings[get().language][key] ?? strings.en[key] ?? key;
        // Replace all occurrences of {{key}} with value from replacements
        for (const [key, value] of _.toPairs(replacements)) {
          string = string.replace(new RegExp(`{{${key}}}`, "g"), value);
        }
        // Replace all occurrences of [[singular|plural]] with singular or plural
        while (true) {
          const match = string.match(/\[\[(.*?)\|(.*?)\]\]/);
          if (match === null) break;
          const [blob, singular, plural] = match;
          string = string.replace(
            blob,
            replacements.count === "1" ? singular : plural,
          );
        }
        // Replace all occurrences of [[key]] with value from strings
        while (true) {
          const match = string.match(/\[\[(.*?)\]\]/);
          if (match === null) break;
          const [blob, key] = match;
          string = string.replace(blob, get().getString(key, replacements));
        }
        return string;
      },
    }),
    {
      name: "fluxolab_strings",
      version: 6,
    },
  ),
);

export default useStoreStrings;
