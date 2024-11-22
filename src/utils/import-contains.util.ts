import type { Import } from "../interfaces/mod.ts";

export function importContains(imports: Import[], type: string) {
  return imports.some((i) => i.type === type);
}
