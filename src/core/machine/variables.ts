import _ from "lodash";

export interface Variable {
  id: string;
  type: "number" | "boolean" | "string";
}

export type VarType = number | boolean | string;

interface VariableType {
  typeName: Variable["type"];
  stringIsValid: (str: string) => boolean;
  stringToValue: (str: string) => VarType;
  valueToString: (value: VarType) => string;
}

export const variableTypes: VariableType[] = [
  {
    typeName: "number",
    stringIsValid(str: string): boolean {
      const floatRegex = /^-?\d+(?:[.]\d*?)?$/;
      return floatRegex.test(str);
    },
    stringToValue: (str: string): number => {
      return parseFloat(str);
    },
    valueToString: (value: number): string => {
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
  {
    typeName: "boolean",
    stringIsValid: (str: string): boolean => {
      return str === "true" || str === "false";
    },
    stringToValue: (str: string): boolean => {
      return str === "true";
    },
    valueToString: (value: boolean): string => {
      return value ? "true" : "false";
    },
  },
  {
    typeName: "string",
    stringIsValid: (str: string): boolean => {
      return true;
    },
    stringToValue: (str: string): string => {
      return str;
    },
    valueToString: (value: string): string => {
      return value;
    },
  },
];

export function getVariableType(typeName: string): VariableType {
  return _.find(variableTypes, { typeName }) as VariableType;
}
