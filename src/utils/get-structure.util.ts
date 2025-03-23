import type { ServerMetadata } from "../../../tinyrpc/types.ts";

export function getStructure(datatypeName: string, instances: ServerMetadata) {
  return instances.structures.find((datatype) => datatype.name === datatypeName);
}
