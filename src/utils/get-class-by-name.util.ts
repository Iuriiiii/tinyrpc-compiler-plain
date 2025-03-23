import type { ServerMetadata } from "../../../tinyrpc/types.ts";

export function getClassByName(name: string, instances: ServerMetadata) {
  return instances.instances.get(name) ?? null;
}
