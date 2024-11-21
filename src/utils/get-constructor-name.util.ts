import type { Constructor } from "../types/mod.ts";

export function getConstructorName(constructor: Constructor) {
  return constructor.name;
}
