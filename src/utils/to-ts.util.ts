import type { DataType } from "@tinyrpc/server/types";
import type { ToTsResponse } from "../interfaces/mod.ts";
import { getEnum, getExposedEnumName, getModule, getStructure, isExposedEnum } from "@tinyrpc/server/utils";
import { isArray, isString } from "@online/is";
import { TsType } from "../enums/mod.ts";
import { getConstructorName } from "./get-constructor-name.util.ts";
import { isClass } from "../validator/mod.ts";
import { SerializableClass } from "@tinyrpc/server";

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
  response: ToTsResponse = { arrayLevel: 0, tsType: TsType.Native, compiled: "", dataTypeName: "" },
) {
  while (isArray(dataType)) {
    response.arrayLevel++;

    // @ts-ignore: Handle empty arrays
    if (dataType.length === 0) {
      response.tsType = TsType.Native;
      response.compiled = response.dataTypeName = "never[]";

      return response;
    }

    // if (dataType.length > 1) {
    //   // TODO: Handle tuples?
    //   break;
    // }

    dataType = dataType[0] as DataType;
  }

  if (PRIMITIVES.has(dataType)) {
    response.tsType = TsType.Native;
    response.compiled = response.dataTypeName = PRIMITIVES.get(dataType)!;
  } else if (isClass(dataType)) {
    do {
      const constructorName = getConstructorName(dataType);
      const module = getModule(constructorName);

      if (module) {
        response.tsType = TsType.Module;
        response.compiled = response.dataTypeName = constructorName;
        response.serializable = module.constructor instanceof SerializableClass;
        break;
      }

      const structure = getStructure(constructorName);

      if (structure) {
        response.tsType = TsType.Structure;
        response.compiled = response.dataTypeName = constructorName;
        response.serializable = structure.constructor instanceof SerializableClass;
        break;
      }

      response.tsType = TsType.Native;
      response.compiled = response.dataTypeName = "never";
    } while (false);
  } else if (dataType instanceof Function) {
    const _dataType = (<() => DataType> dataType)();

    return toTs(_dataType, response);
  } else if (isString(dataType)) {
    // Improve this to analyse complex types and import required files if needed
    do {
      const module = getModule(dataType);

      if (module) {
        response.tsType = TsType.Module;
        response.compiled = response.dataTypeName = dataType;
        response.serializable = module.constructor instanceof SerializableClass;
        break;
      }

      const structure = getStructure(dataType);

      if (structure) {
        response.tsType = TsType.Structure;
        response.compiled = response.dataTypeName = dataType;
        response.serializable = structure.constructor instanceof SerializableClass;
        break;
      }

      const _enum = getEnum(dataType);

      if (_enum) {
        response.tsType = TsType.Enum;
        response.compiled = response.dataTypeName = dataType;
        break;
      }

      if (PRIMITIVES.has(dataType)) {
        response.tsType = TsType.Native;
        response.compiled = response.dataTypeName = PRIMITIVES.get(dataType)!;
        break;
      }

      response.tsType = TsType.Native;
      response.compiled = response.dataTypeName = "never";
    } while (false);
  } else if (isExposedEnum(dataType)) {
    response.tsType = TsType.Enum;
    response.compiled = response.dataTypeName = getExposedEnumName(dataType)!;
  }

  response.compiled += "[]".repeat(response.arrayLevel);

  return response;
}
