import type { CompilerOptions } from "@tinyrpc/server/types";
import type { Import, ToTsResponse } from "../interfaces/mod.ts";
import { toFilename } from "./to-filename.util.ts";
import { TsType } from "../enums/mod.ts";

export function pushImport({ type, dataType }: ToTsResponse, imports: Import[], _options: CompilerOptions) {
  const isModule = type === TsType.Module;
  const isEnum = type === TsType.Enum;
  const fileName = toFilename(dataType, isModule ? "api" : isEnum ? "enum" : "structure");
  const item: Import = {
    type: dataType,
    fileName,
    folder: isModule ? "." : isEnum ? "../enums" : "../structures",
    isModule,
  };

  imports.push(item);
}
