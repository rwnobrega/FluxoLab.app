import _ from "lodash";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import stringsJson from "~/assets/strings.json";

const strings: Record<string, Record<string, string>> = stringsJson;

// The browser reports whatever tag the reader configured (`pt-PT`, `en-GB`,
// `pt`), but strings only exist for a few of them. Resolve a preference list
// onto a supported tag: exact match first, then any language with the same
// primary subtag, so a reader in Portugal gets Portuguese rather than English.
// Storing the resolved tag instead of the raw one is what keeps `language` in
// agreement with the strings actually on screen.
export function resolveLanguage(tags: readonly string[]): string {
  const supported = _.keys(strings);
  const primary = (tag: string) => _.toLower(tag).split("-")[0];
  for (const tag of tags) {
    const match =
      _.find(supported, (lang) => _.toLower(lang) === _.toLower(tag)) ??
      _.find(supported, (lang) => primary(lang) === primary(tag));
    if (match !== undefined) return match;
  }
  return "en";
}

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
      language: resolveLanguage(navigator.languages),
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
      version: 2,
      migrate: (persisted: any, version: number) => {
        if (version < 2 && persisted !== null) {
          // `language` used to be `navigator.language` verbatim, so it could
          // be a tag with no strings behind it: the reader saw English while
          // the stored tag still said `pt-PT`.
          persisted.language = resolveLanguage([persisted.language ?? ""]);
        }
        return persisted;
      },
    },
  ),
);

export default useStoreStrings;
