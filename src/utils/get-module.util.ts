import type { ServerMetadata } from "@tinyrpc/server/types";

export function getModule(datatypeName: string, instances: ServerMetadata) {
  return instances.modules.find((datatype) => datatype.name === datatypeName);
}
