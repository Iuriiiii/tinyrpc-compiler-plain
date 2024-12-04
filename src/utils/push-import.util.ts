import type { CompilerOptions } from "@tinyrpc/server/types";
import type { Import } from "../interfaces/mod.ts";
import { getModule } from "./get-module.util.ts";
import { toFilename } from "./to-filename.util.ts";
import { getEnum } from "./get-enum.util.ts";

export function pushImport(type: string, imports: Import[], options: CompilerOptions) {
  const isModule = !!getModule(type, options.metadata);
  const isEnum = !!getEnum(type, options.metadata);
  const fileName = toFilename(type, isModule ? "api" : isEnum ? "enum" : "structure");
  const item: Import = {
    type,
    fileName,
    folder: isModule ? "." : isEnum ? "../enums" : "../structures",
    isModule,
  };

  imports.push(item);
}
