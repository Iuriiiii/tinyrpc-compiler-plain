import type { CompilerOptions, ParameterMetadata } from "@tinyrpc/server";
import { getTypescriptType } from "../utils/mod.ts";

export function getParamName(param: ParameterMetadata) {
  const { index } = param;
  const { name = `param${index}` } = param;

  return name;
}

export function buildParam(
  param: ParameterMetadata,
  buildImports: string[],
  options: CompilerOptions,
) {
  const paramName = getParamName(param);
  const { dataType } = param;
  const { typescriptType: buildType, requireImport } = getTypescriptType(
    dataType,
    options.metadata,
  );
  const sign = param.optional ? "?" : "";

  if (requireImport && !buildImports.includes(buildType)) {
    buildImports.push(buildType);
  }

  // if (!buildType) {
  //   if (!(type instanceof Serializable)) {
  //     throw new Error(`Unknown type: ${type}`);
  //   }

  //   // TODO: Do something with serializable parameter
  // }

  const output = `${paramName}${sign}: ${buildType}`.trim();

  return output;
}
