import { contrastBrightness, convert } from "colvertize";

function brighter(color: string, amount: number = 32): string {
  return convert(color, "css-hex", contrastBrightness({ brightness: amount }));
}

function darker(color: string, amount: number = 32): string {
  return convert(color, "css-hex", contrastBrightness({ brightness: -amount }));
}

export default { brighter, darker };
