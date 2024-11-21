import { getTypescriptType } from "../utils/mod.ts";
import type { CompilerOptions, MemberMetadata } from "@tinyrpc/server";

export function buildMember(
  member: MemberMetadata,
  buildImports: string[],
  options: CompilerOptions,
) {
  const {
    dataType,
    name: memberName,
    optional,
    defaultValue,
    private: isPrivate,
    nullable,
    readonly,
  } = member;
  const { typescriptType: buildType, requireImport } = getTypescriptType(
    dataType,
    options.metadata,
  );
  const makeOptional = optional ? "?" : "";
  const makeDefaultValue = defaultValue !== undefined
    ? ` = ${defaultValue}`
    : "";
  const makePrivate = isPrivate ? "private " : "public ";
  const makeNullable = nullable ? " | null" : "";
  const makeLateInit = defaultValue === undefined && !optional ? "!" : "";
  const makeReadonly = readonly ? "readonly " : "";

  if (requireImport && !buildImports.includes(buildType)) {
    buildImports.push(buildType);
  }

  return `${makePrivate}${makeReadonly}${memberName}${makeOptional}${makeLateInit}: ${buildType}${makeDefaultValue}${makeNullable}`;
}
