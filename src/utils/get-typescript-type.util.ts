import type { DataType, ServerMetadata } from "@tinyrpc/server/types";
import type { Constructor } from "../types/mod.ts";
import type { GetTypescriptTypeResult } from "../interfaces/mod.ts";
import { getStructure } from "./get-structure.util.ts";
import { getConstructorName } from "./get-constructor-name.util.ts";
import { isArray, isString, isUndefined } from "@online/is";
import { getEnum } from "./get-enum.util.ts";
import { TsType } from "../enums/mod.ts";

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

export function getTypescriptType(
  value: DataType,
  instances: ServerMetadata,
): GetTypescriptTypeResult {
  let postfix = "";
  let wasArrayOrFunction = false;

  while (isArray(value)) {
    value = value[0] as DataType;
    postfix += "[]";
    wasArrayOrFunction = true;
  }

  // Is a common function
  while (typeof value === "function" && value.name.length === 0) {
    value = (value as () => unknown)() as DataType;
    wasArrayOrFunction = true;
  }

  if (wasArrayOrFunction) {
    const result = getTypescriptType(value, instances);

    return { ...result, calculatedTsType: result.tsType + postfix };
  }

  // @ts-ignore: Just translate type constructor to ts type
  const tsType: string | object | undefined = TypesToTSTypes[value];

  const enumerator = getEnum(value, instances);

  if (enumerator) {
    return {
      tsType: enumerator.name,
      requireImport: true,
      postfix: "",
      calculatedTsType: enumerator.name,
      type: TsType.Enum,
    };
  }

  if (isUndefined(tsType)) {
    if (value instanceof Function) {
      value = getConstructorName(value as Constructor);
    }

    const datatype = getStructure(value! as string, instances);

    if (datatype) {
      return {
        tsType: datatype.constructor.name,
        requireImport: true,
        postfix: "",
        calculatedTsType: datatype.constructor.name,
        type: TsType.Structure,
      };
    }

    if (isString(value)) {
      return {
        tsType: value,
        requireImport: false,
        postfix: "",
        calculatedTsType: value,
        type: TsType.Native,
      };
    }

    return { tsType: "void", postfix: "", calculatedTsType: "void", type: TsType.Native };
  }

  return { tsType: tsType as string, postfix: "", calculatedTsType: tsType as string, type: TsType.Native };
}
