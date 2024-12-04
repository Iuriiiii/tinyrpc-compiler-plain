import type { ServerMetadata } from "@tinyrpc/server/types";
import { isString } from "@online/is";

export function getEnum(value: object | string, instances: ServerMetadata) {
  return instances.enums.find(({ name: enumName, value: enumerator }) => isString(value) ? value === enumName : value === enumerator);
}
