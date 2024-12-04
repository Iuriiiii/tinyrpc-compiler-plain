import type { Import } from "../interfaces/mod.ts";
import type { CompilerOptions, MemberMetadata } from "@tinyrpc/server/types";
import { getTypescriptType, pushTypeIfNeeded, sassert } from "../utils/mod.ts";

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
  const typeResult = getTypescriptType(
    dataType,
    options.metadata,
  );

  const { calculatedTsType } = typeResult;
  const makePrivate = isPrivate ? "private " : "public ";
  const makeNullable = sassert(nullable && " | null");

  pushTypeIfNeeded(typeResult, buildImports, options);

  return `${makePrivate}readonly ${memberName}: ${calculatedTsType}${makeNullable}`;
}
