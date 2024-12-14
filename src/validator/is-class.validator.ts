import type { Constructor } from "../types/mod.ts";

export function isClass(value: unknown): value is Constructor {
  return typeof value === "function" && /^class\s/.test(value.toString());
}
