import type { CompilerOptions } from "../../../tinyrpc/types.ts";
import type { Import, ToTsResponse } from "../interfaces/mod.ts";
import { toFilename } from "./to-filename.util.ts";
import { TsType } from "../enums/mod.ts";

export function pushImport({ tsType, dataTypeName }: ToTsResponse, imports: Import[], _options: CompilerOptions) {
  const isModule = tsType === TsType.Module;
  const isEnum = tsType === TsType.Enum;
  const fileName = toFilename(dataTypeName, isModule ? "api" : isEnum ? "enum" : "structure");
  const item: Import = {
    type: dataTypeName,
    fileName,
    folder: isModule ? "." : isEnum ? "../enums" : "../structures",
    isModule,
  };

  imports.push(item);
}
