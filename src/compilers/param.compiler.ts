import type { Import } from "../interfaces/mod.ts";
import type { CompilerOptions, MemberMetadata } from "@tinyrpc/server";
import { getTypescriptType, pushTypeIfNeeded } from "../utils/mod.ts";

export function paramCompiler(
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

  const { typescriptType: buildType } = typeResult;
  const makePrivate = isPrivate ? "private " : "public ";
  const makeNullable = nullable ? " | null" : "";

  pushTypeIfNeeded(typeResult, buildImports, options);

  return `${makePrivate}readonly ${memberName}: ${buildType}${makeNullable}`;
}
