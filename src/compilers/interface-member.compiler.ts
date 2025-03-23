import type { CompilerOptions, MethodMetadata, ParameterMetadata } from "../../../tinyrpc/types.ts";
import type { Import } from "../interfaces/mod.ts";
import { pushTypeIfNeeded, sassert } from "../utils/mod.ts";
import { toTs } from "../utils/to-ts.util.ts";
import { TsType } from "../enums/mod.ts";

export function interfaceMemberCompiler(
  _method: MethodMetadata,
  parameter: ParameterMetadata,
  imports: Import[],
  options: CompilerOptions,
) {
  const compiledTs = toTs(parameter.dataType);
  const { compiled, tsType } = compiledTs;
  const makeOptional = sassert(parameter.optional && "?");
  const name = sassert(parameter.name, `p${parameter.index}`);
  const isModuleOrStructure = tsType === TsType.Module || tsType === TsType.Structure;
  const compiledType = sassert(isModuleOrStructure && `ClassOrInterface<${compiled}>`, compiled);

  pushTypeIfNeeded(compiledTs, imports, options);

  return { builded: `${name}${makeOptional}:${compiledType}`, preBuild: `${name}${makeOptional}`, compiledTs };
}
