import type { Import } from "../interfaces/mod.ts";
import type { CompilerOptions, MemberMetadata } from "../../../tinyrpc/types.ts";
import { pushTypeIfNeeded, sassert } from "../utils/mod.ts";
import { toTs } from "../utils/to-ts.util.ts";

export function constructorParamCompiler(
  member: MemberMetadata,
  buildImports: Import[],
  options: CompilerOptions,
) {
  const {
    dataType,
    name: memberName,
    private: isPrivate,
    nullable,
  } = member;
  const compiledTs = toTs(dataType);

  const { compiled } = compiledTs;
  const makePrivate = isPrivate ? "private " : "public ";
  const makeNullable = sassert(nullable && " | null");

  pushTypeIfNeeded(compiledTs, buildImports, options);

  return `${makePrivate}readonly ${memberName}: ${compiled}${makeNullable}`;
}
