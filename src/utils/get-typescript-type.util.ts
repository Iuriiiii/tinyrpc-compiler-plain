import { ServerMetadata } from "@tinyrpc/server";
import { Constructor } from "../types/mod.ts";
import { getConstructorName } from "./get-constructor-name.util.ts";
import { getStructure } from "./get-structure.util.ts";

const TypesToTSTypes = {
  // @ts-ignore: Allow custom key
  [String]: "string",
  // @ts-ignore: Allow custom key
  [Number]: "number",
  // @ts-ignore: Allow custom key
  [Boolean]: "boolean",
  // @ts-ignore: Allow custom key
  [Date]: "Date",
  // @ts-ignore: Allow custom key
  [Array]: "Array<unknown>",
  // @ts-ignore: Allow custom key
  [Object]: "object",
  // @ts-ignore: Allow custom key
  [undefined]: "undefined",
  // @ts-ignore: Allow custom key
  [null]: "null",
  // @ts-ignore: Allow custom key
  [Symbol]: "symbol",
  // @ts-ignore: Allow custom key
  [BigInt]: "bigint",
  // @ts-ignore: Allow custom key
  [Set]: "Set<unknown>",
  // @ts-ignore: Allow custom key
  "string": "string",
  // @ts-ignore: Allow custom key
  "number": "number",
  // @ts-ignore: Allow custom key
  "boolean": "boolean",
  // @ts-ignore: Allow custom key
  "Date": "Date",
  // @ts-ignore: Allow custom key
  "Array": "Array<any>",
  // @ts-ignore: Allow custom key
  "any": "any",
  // @ts-ignore: Allow custom key
  "symbol": "symbol",
  "Symbol": "symbol",
  // @ts-ignore: Allow custom key
  "bigint": "bigint",
  "BigInt": "bigint",
  // @ts-ignore: Allow custom key
  "Set": "Set<unknown>",
};

interface GetTypescriptTypeResult {
  typescriptType: string;
  requireImport?: boolean;
}

export function getTypescriptType(
  value: Constructor | string | null | undefined,
  instances: ServerMetadata,
): GetTypescriptTypeResult {
  // @ts-ignore: Just translate type constructor to ts type
  const tsType: string | undefined = TypesToTSTypes[value];

  if (!tsType) {
    if (value instanceof Function) {
      value = getConstructorName(value);
    }

    const datatype = getStructure(value!, instances);

    if (datatype) {
      return {
        typescriptType: datatype.constructor.name,
        requireImport: true,
      };
    } else if (typeof value === "string") {
      return {
        typescriptType: value,
        requireImport: false,
      };
    }

    return { typescriptType: "void" };
  }

  return { typescriptType: tsType };
}
