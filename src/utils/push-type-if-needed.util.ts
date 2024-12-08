import type { CompilerOptions } from "@tinyrpc/server/types";
import type { GetTypescriptTypeResult, Import } from "../interfaces/mod.ts";
import { importContains } from "./import-contains.util.ts";
import { pushImport } from "./push-import.util.ts";

export function pushTypeIfNeeded(
  { tsType: type, requireImport }: GetTypescriptTypeResult,
  imports: Import[],
  options: CompilerOptions,
) {
  if (requireImport && !importContains(imports, type)) {
    pushImport(type, imports, options);
  }
}
