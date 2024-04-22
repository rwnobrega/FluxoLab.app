import grammar from "./grammar";

export default function (identifier: string): boolean {
  const matchResult = grammar.match(identifier, "identifier");
  return matchResult.succeeded();
}
