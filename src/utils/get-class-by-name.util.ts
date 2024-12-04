import type { ServerMetadata } from "@tinyrpc/server/types";

export function getClassByName(name: string, instances: ServerMetadata) {
  return instances.instances.get(name) ?? null;
}
