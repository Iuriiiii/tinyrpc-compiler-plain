import type { ServerMetadata } from "@tinyrpc/server/types";

export function getStructure(datatypeName: string, instances: ServerMetadata) {
  return instances.structures.find((datatype) => datatype.name === datatypeName);
}
