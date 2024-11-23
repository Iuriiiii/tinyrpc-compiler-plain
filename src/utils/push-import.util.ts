import type { CompilerOptions } from "@tinyrpc/server";
import type { Import } from "../interfaces/mod.ts";
import { getModule } from "./get-module.util.ts";
import { toFilename } from "./to-filename.util.ts";

export function pushImport(type: string, imports: Import[], options: CompilerOptions) {
  const isModule = !!getModule(type, options.metadata);
  const fileName = toFilename(type, isModule ? "api" : "structure");
  const item: Import = {
    type,
    fileName,
    folder: isModule ? "." : "../structures",
    isModule,
  };

  imports.push(item);
}
