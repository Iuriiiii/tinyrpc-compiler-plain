import type { ServerMetadata } from "@tinyrpc/server/types";

export function getEnum(name: string, instances: ServerMetadata) {
  return instances.enums.find((datatype) => datatype.name === name);
}
