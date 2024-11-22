import type { CompilerOptions, ParameterMetadata } from "@tinyrpc/server";
import type { Import } from "../interfaces/mod.ts";
import { getTypescriptType, pushTypeIfNeeded } from "../utils/mod.ts";

export function getParamName(param: ParameterMetadata) {
  const { index } = param;
  const { name = `param${index}` } = param;

  return name;
}

export function buildParam(
  param: ParameterMetadata,
  buildImports: Import[],
  options: CompilerOptions,
) {
  const paramName = getParamName(param);
  const { dataType } = param;
  const typeResult = getTypescriptType(
    dataType,
    options.metadata,
  );

  const { typescriptType: buildType } = typeResult;
  const sign = param.optional ? "?" : "";

  pushTypeIfNeeded(typeResult, buildImports, options);

  const output = `${paramName}${sign}: ${buildType}`.trim();

  return output;
}
