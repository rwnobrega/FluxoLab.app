export enum DataType {
  Number = "number",
  Boolean = "boolean",
  String = "string",
}

interface DataParser {
  stringIsValid: (str: string) => boolean;
  read: (str: string) => any;
  write: (value: any) => string;
}

const DATA_PARSERS: Record<DataType, DataParser> = {
  number: {
    stringIsValid(str: string): boolean {
      const floatRegex = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/;
      return floatRegex.test(str);
    },
    read: (str: string): number => {
      return parseFloat(str);
    },
    write: (value: number): string => {
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
    read: (str: string): boolean => {
      return str === "true";
    },
    write: (value: boolean): string => {
      return value ? "true" : "false";
    },
  },
  string: {
    stringIsValid(_str: string): boolean {
      return true;
    },
    read: (str: string): string => {
      return str;
    },
    write: (value: string): string => {
      return value;
    },
  },
};

export function getDataParser(dataType: DataType): DataParser {
  return DATA_PARSERS[dataType];
}
