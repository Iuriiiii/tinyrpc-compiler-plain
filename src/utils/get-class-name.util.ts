import type { Constructor } from "../types/mod.ts";

export function getClassName(clazz: Constructor) {
  return clazz.name;
}
