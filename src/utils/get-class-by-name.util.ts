import type { ServerMetadata } from "@tinyrpc/server";

export function getClassByName(name: string, instances: ServerMetadata) {
  return instances.instances.get(name) ?? null;
}
