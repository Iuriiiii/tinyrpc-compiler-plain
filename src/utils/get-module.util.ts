import type { ServerMetadata } from "@tinyrpc/server";

export function getModule(datatypeName: string, instances: ServerMetadata) {
  return instances.modules.find((datatype) => datatype.name === datatypeName);
}
