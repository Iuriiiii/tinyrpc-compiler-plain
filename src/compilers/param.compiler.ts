import type { CompilerOptions, MethodMetadata, ParameterMetadata } from "@tinyrpc/server";
import type { Import } from "../interfaces/mod.ts";
import { getTypescriptType, pushTypeIfNeeded, sassert } from "../utils/mod.ts";

export function paramCompiler(_method: MethodMetadata, parameter: ParameterMetadata, imports: Import[], options: CompilerOptions) {
  const typeResult = getTypescriptType(parameter.dataType, options.metadata);
  const { tsType: type } = typeResult;
  const makeOptional = sassert(parameter.optional && "?");
  const name = sassert(parameter.name, `p${parameter.index}`);

  pushTypeIfNeeded(typeResult, imports, options);

  return `${name}${makeOptional}${type}`;
}
