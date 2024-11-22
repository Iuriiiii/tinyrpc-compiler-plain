import type { Import } from "../interfaces/mod.ts";
import type { CompilerOptions, MemberMetadata } from "@tinyrpc/server";
import { getTypescriptType, importContains, pushTypeIfNeeded, sassert } from "../utils/mod.ts";

export function buildMember(
  member: MemberMetadata,
  buildImports: Import[],
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
  const typeResult = getTypescriptType(
    dataType,
    options.metadata,
  );

  const { typescriptType: buildType } = typeResult;
  const makeOptional = sassert(optional && "?");
  const makeDefaultValue = sassert(defaultValue !== undefined && ` = ${defaultValue}`);
  const makePrivate = sassert(isPrivate && "private ", "public ");
  const makeNullable = sassert(nullable && " | null");
  const makeLateInit = sassert(defaultValue === undefined && !optional && "!");
  const makeReadonly = sassert(readonly && "readonly ");

  pushTypeIfNeeded(typeResult, buildImports, options);

  return `${makePrivate}${makeReadonly}${memberName}${makeOptional}${makeLateInit}: ${buildType}${makeDefaultValue}${makeNullable}`;
}
