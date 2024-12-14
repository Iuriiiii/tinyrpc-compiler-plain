import type { CompilerOptions, MethodMetadata, ParameterMetadata } from "@tinyrpc/server/types";
import type { Import } from "../interfaces/mod.ts";
import { pushTypeIfNeeded, sassert } from "../utils/mod.ts";
import { toTs } from "../utils/to-ts.util.ts";

export function interfaceMemberCompiler(
  _method: MethodMetadata,
  parameter: ParameterMetadata,
  imports: Import[],
  options: CompilerOptions,
) {
  const compiledTs = toTs(parameter.dataType);
  const { compiled } = compiledTs;
  const makeOptional = sassert(parameter.optional && "?");
  const name = sassert(parameter.name, `p${parameter.index}`);

  pushTypeIfNeeded(compiledTs, imports, options);

  return `${name}${makeOptional}:${compiled}`;
}
