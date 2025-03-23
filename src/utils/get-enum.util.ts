import type { ServerMetadata } from "../../../tinyrpc/types.ts";
import { isString } from "@online/is";

export function getEnum(value: object | string, instances: ServerMetadata) {
  return instances.enums.find(({ name: enumName, value: enumerator }) =>
    isString(value) ? value === enumName : value === enumerator
  );
}
