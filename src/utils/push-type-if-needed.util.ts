import type { CompilerOptions } from "@tinyrpc/server/types";
import type { Import, ToTsResponse } from "../interfaces/mod.ts";
import { importContains } from "./import-contains.util.ts";
import { pushImport } from "./push-import.util.ts";
import { TsType } from "../enums/mod.ts";

export function pushTypeIfNeeded(
  compiledTs: ToTsResponse,
  imports: Import[],
  options: CompilerOptions,
) {
  if (compiledTs.type !== TsType.Native && !importContains(imports, compiledTs.dataType)) {
    pushImport(compiledTs, imports, options);
  }
}
