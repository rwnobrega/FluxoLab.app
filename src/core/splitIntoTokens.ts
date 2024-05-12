export default function (input: string): string[] {
  const tokens: string[] = [];
  let currentToken = "";
  let inQuotes = false;
  let escapeNext = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (escapeNext) {
      currentToken += char;
      escapeNext = false;
    } else if (char === "\\") {
      escapeNext = true;
    } else if (char === '"') {
      if (inQuotes) {
        tokens.push(currentToken);
        currentToken = "";
        inQuotes = false;
      } else {
        inQuotes = true;
      }
    } else if (char === " " && !inQuotes) {
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = "";
      }
    } else {
      currentToken += char;
    }
  }

  if (currentToken) {
    tokens.push(currentToken);
  }

  return tokens;
}
