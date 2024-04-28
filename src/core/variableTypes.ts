export const variableTypeIds = ["number", "boolean", "string"] as const;
export type VariableTypeId = (typeof variableTypeIds)[number];

interface VariableType {
  stringIsValid: (str: string) => boolean;
  parse: (str: string) => any;
  stringify: (value: any) => string;
}

const variableTypes: Record<VariableTypeId, VariableType> = {
  number: {
    stringIsValid(str: string): boolean {
      const floatRegex = /^-?\d+(?:[.]\d*?)?$/;
      return floatRegex.test(str);
    },
    parse: (str: string): number => {
      return parseFloat(str);
    },
    stringify: (value: number): string => {
      const p: string = value.toPrecision(6);
      if (p.includes("e")) {
        const [mantissa, signal, exponent] = p.split(/e([+-])/);
        return (
          mantissa.replace(/0+$/, "").replace(/\.$/, "") +
          "e" +
          signal +
          exponent.padStart(2, "0")
        );
      }
      if (p.includes(".")) {
        return p.replace(/0+$/, "").replace(/\.$/, "");
      }
      return p;
    },
  },
  boolean: {
    stringIsValid(str: string): boolean {
      return str === "true" || str === "false";
    },
    parse: (str: string): boolean => {
      return str === "true";
    },
    stringify: (value: boolean): string => {
      return value ? "true" : "false";
    },
  },
  string: {
    stringIsValid(str: string): boolean {
      return true;
    },
    parse: (str: string): string => {
      return str;
    },
    stringify: (value: string): string => {
      return value;
    },
  },
};

export function getVariableType(id: VariableTypeId): VariableType {
  return variableTypes[id];
}
