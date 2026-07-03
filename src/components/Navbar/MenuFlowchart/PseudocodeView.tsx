import _ from "lodash";
import React from "react";

import { constants, functions } from "~/core/language/library";

/*  Lightweight, read-only syntax highlighting for generated pseudocode.
 *  Token classes and colors mirror the PseudoLab Monaco light theme, for
 *  cross-project visual consistency.  Function and constant names are
 *  derived from the language library, so they never drift from the core. */

const KEYWORDS = new Set([
  "Variáveis",
  "Início",
  "Fim",
  "Leia",
  "Escreva",
  "Se",
  "SenãoSe",
  "Senão",
  "FimSe",
  "Enquanto",
  "FimEnquanto",
  "Faça",
  "enquanto",
]);

const TYPES = new Set(["número", "lógico", "texto"]);
const WORD_OPERATORS = new Set(["div", "mod"]);
const BOOLEANS = new Set(["true", "false"]);
const BUILTINS = new Set([
  ..._.map(functions, "id"),
  ..._.map(constants, "id"),
]);

const STYLES: Record<string, React.CSSProperties> = {
  keyword: { color: "#DB2777", fontWeight: "bold" }, // pink-600
  type: { color: "#059669", fontStyle: "italic" }, // emerald-600
  builtin: { color: "#D97706" }, // amber-600
  variable: { color: "#4F46E5" }, // indigo-600
  number: { color: "#DC2626" }, // red-600
  string: { color: "#059669" }, // green-600
  operator: { color: "#111827" }, // gray-900
  comment: { color: "#6B7280" }, // gray-500
};

const TOKEN_REGEX = new RegExp(
  [
    /(?<comment>\/\/.*)/,
    /(?<string>"(?:[^"\\\n]|\\.)*"?)/,
    /(?<number>\d+(?:\.\d+)?(?:[Ee][+-]?\d+)?)/,
    /(?<word>[A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_]*)/,
    /(?<operator>==|!=|<=|>=|&&|\|\||[=+\-*/<>!])/,
  ]
    .map((part) => part.source)
    .join("|"),
  "g",
);

function classifyWord(word: string): string {
  if (KEYWORDS.has(word)) return "keyword";
  if (TYPES.has(word)) return "type";
  if (WORD_OPERATORS.has(word)) return "operator";
  if (BOOLEANS.has(word)) return "number";
  if (BUILTINS.has(word)) return "builtin";
  return "variable";
}

function highlight(code: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of code.matchAll(TOKEN_REGEX)) {
    const index = match.index as number;
    const groups = match.groups as Record<string, string | undefined>;
    if (index > last) nodes.push(code.slice(last, index));
    const kind =
      groups.word !== undefined
        ? classifyWord(groups.word)
        : (_.findKey(groups, (value) => value !== undefined) as string);
    nodes.push(
      <span key={index} style={STYLES[kind]}>
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
}

interface Props {
  code: string;
}

export default function ({ code }: Props): JSX.Element {
  return (
    <pre
      className="border rounded p-3 mb-0"
      style={{
        backgroundColor: "#F9FAFB", // gray-50
        color: "#1F2937", // gray-800
        maxHeight: "60vh",
        overflow: "auto",
      }}
    >
      {highlight(code)}
    </pre>
  );
}
