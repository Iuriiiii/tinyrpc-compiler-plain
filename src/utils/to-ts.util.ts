import type { DataType } from "@tinyrpc/server/types";
import type { ToTsResponse } from "../interfaces/mod.ts";
import { getEnum, getExposedEnumName, getModule, getStructure, isExposedEnum } from "@tinyrpc/server/utils";
import { isArray, isString } from "@online/is";
import { TsType } from "../enums/mod.ts";
import { getConstructorName } from "./get-constructor-name.util.ts";
import { isClass } from "../validator/mod.ts";

const PRIMITIVES = new Map<unknown, string>([
  [Boolean, "boolean"],
  [Number, "number"],
  [String, "string"],
  [Date, "Date"],
  [undefined, "undefined"],
  [null, "null"],
  [Symbol, "symbol"],
  [BigInt, "bigint"],
  [Object, "object"],
  [Array, "Array<unknown>"],
  [Set, "Set<unknown>"],
  ["string", "string"],
  ["number", "number"],
  ["boolean", "boolean"],
  ["Date", "Date"],
  ["Array", "Array<any>"],
  ["any", "any"],
  ["symbol", "symbol"],
  ["Symbol", "symbol"],
  ["bigint", "bigint"],
  ["BigInt", "bigint"],
  ["Set", "Set<unknown>"],
]);

export function toTs(
  dataType: DataType,
  response: ToTsResponse = { arrayLevel: 0, type: TsType.Native, compiled: "", dataType: "" },
) {
  while (isArray(dataType)) {
    response.arrayLevel++;

    // @ts-ignore: Handle empty arrays
    if (dataType.length === 0) {
      response.type = TsType.Native;
      response.compiled = response.dataType = "never[]";
      
      return response;
    }

    // if (dataType.length > 1) {
    //   // TODO: Handle tuples?
    //   break;
    // }

    dataType = dataType[0] as DataType;
  }

  if (PRIMITIVES.has(dataType)) {
    response.type = TsType.Native;
    response.compiled = response.dataType = PRIMITIVES.get(dataType)!;
  } else if (isClass(dataType)) {
    do {
      const constructorName = getConstructorName(dataType);
      const module = getModule(constructorName);

      if (module) {
        response.type = TsType.Module;
        response.compiled = response.dataType = constructorName;
        break;
      }

      const structure = getStructure(constructorName);

      if (structure) {
        response.type = TsType.Structure;
        response.compiled = response.dataType = constructorName;
        break;
      }

      response.type = TsType.Native;
      response.compiled = response.dataType = "never";
    } while (false);
  } else if (dataType instanceof Function) {
    const _dataType = (<() => DataType> dataType)();

    return toTs(_dataType, response);
  } else if (isString(dataType)) {
    // Improve this to analyse complex types and import required files if needed
    do {
      const structure = getStructure(dataType);

      if (structure) {
        response.type = TsType.Structure;
        response.compiled = response.dataType = dataType;
        break;
      }

      const _enum = getEnum(dataType);

      if (_enum) {
        response.type = TsType.Enum;
        response.compiled = response.dataType = dataType;
        break;
      }

      if (PRIMITIVES.has(dataType)) {
        response.type = TsType.Native;
        response.compiled = response.dataType = PRIMITIVES.get(dataType)!;
        break;
      }

      response.type = TsType.Native;
      response.compiled = response.dataType = "never";
    } while (false);
  } else if (isExposedEnum(dataType)) {
    response.type = TsType.Enum;
    response.compiled = response.dataType = getExposedEnumName(dataType)!;
  }

  response.compiled += "[]".repeat(response.arrayLevel);

  return response;
}
