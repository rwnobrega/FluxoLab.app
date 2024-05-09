import _ from "lodash";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import stringsJson from "~/assets/strings.json";

const strings: Record<string, Record<string, string>> = stringsJson;

type Replacement = string | number | boolean | Array<string | number | boolean>;

interface StoreStrings {
  language: string;
  setLanguage: (language: string) => void;
  getString: (
    key: string,
    replacements?: Record<string, Replacement>,
  ) => string;
}

const useStoreStrings = create<StoreStrings>()(
  persist(
    (set, get) => ({
      language: navigator.language,
      setLanguage: (language) => set({ language }),
      getString: (key: string, replacements = {}) => {
        const stringsLanguage = strings[get().language] ?? strings.en;
        let string = stringsLanguage[key] ?? key;

        // Replace all occurrences of {{key}} with value from replacements
        for (const [key, value] of _.toPairs(replacements)) {
          const strValue = _.isArray(value) ? value.join(", ") : String(value);
          string = string.replace(new RegExp(`{{${key}}}`, "g"), strValue);
        }

        // Handle replacements like {{prefix@myList@postfix}}
        const pattern = /{{(.*?)@(.*?)@(.*?)}}/g;
        string = string.replace(pattern, (match, prefix, listKey, postfix) => {
          const list = replacements[listKey];
          if (!list || !_.isArray(list)) return match; // Return original if no list found
          return list.map((item) => `${prefix}${item}${postfix}`).join(", ");
        });

        // Replace all occurrences of [[singular|plural]] with singular or plural
        while (true) {
          const match = string.match(/\[\[(.*?)\|(.*?)\]\]/);
          if (match === null) break;
          const [blob, singular, plural] = match;
          string = string.replace(
            blob,
            replacements.count === 1 ? singular : plural,
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
      version: 1,
    },
  ),
);

export default useStoreStrings;
