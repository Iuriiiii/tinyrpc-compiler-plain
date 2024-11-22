import { getTypescriptType } from "../utils/mod.ts";
import type { CompilerOptions, MemberMetadata } from "@tinyrpc/server";

export function paramCompiler(
  member: MemberMetadata,
  buildImports: string[],
  options: CompilerOptions,
) {
  const {
    dataType,
    name: memberName,
    private: isPrivate,
    nullable,
  } = member;
  const { typescriptType: buildType, requireImport } = getTypescriptType(
    dataType,
    options.metadata,
  );
  const makePrivate = isPrivate ? "private " : "public ";
  const makeNullable = nullable ? " | null" : "";

  if (requireImport && !buildImports.includes(buildType)) {
    buildImports.push(buildType);
  }

  return `${makePrivate}readonly${memberName}: ${buildType}${makeNullable}`;
}
