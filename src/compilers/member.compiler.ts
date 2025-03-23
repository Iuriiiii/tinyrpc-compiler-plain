import type { Import } from "../interfaces/mod.ts";
import type { CompilerOptions, MemberMetadata } from "../../../tinyrpc/types.ts";
import { pushTypeIfNeeded, sassert } from "../utils/mod.ts";
import { toTs } from "../utils/to-ts.util.ts";

export function memberCompiler(
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
  const compiledTs = toTs(dataType);
  const { compiled } = compiledTs;
  const makeOptional = sassert(optional && "?");
  const makeDefaultValue = sassert(defaultValue !== undefined && ` = ${defaultValue}`);
  const makePrivate = sassert(isPrivate && "private ", "public ");
  const makeNullable = sassert(nullable && " | null");
  const makeLateInit = sassert(defaultValue === undefined && !optional && "!");
  const makeReadonly = sassert(readonly && "readonly ");

  pushTypeIfNeeded(compiledTs, buildImports, options);

  return `${makePrivate}${makeReadonly}${memberName}${makeOptional}${makeLateInit}: ${compiled}${makeDefaultValue}${makeNullable}`;
}
