import * as ohm from "ohm-js";

export function getExpectedText(matchResult: ohm.MatchResult): string {
  // @ts-expect-error  // TODO: Why is this necessary?
  const failures = matchResult.getRightmostFailures();
  let expectedText = "";
  for (let i = 0; i < failures.length; i++) {
    if (i > 0) {
      expectedText += ", ";
    }
    const failure = failures[i];
    if (failure.type === "description") {
      expectedText += (failure.text as string).replace(
        /end of input/g,
        "[[Syntax_EndOfInput]]",
      );
    } else {
      expectedText += `\`${failure.text as string}\``;
    }
  }
  return expectedText;
}
