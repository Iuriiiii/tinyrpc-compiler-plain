import type { CompilerOptions, EnumMetadata } from "@tinyrpc/server/types";
import { isNumber } from "@online/is";
import { getEnumKeys } from "../utils/mod.ts";

function quoteKeyIfNeeded(value: string) {
  return value.match(/\s+/) ? `"${value}"` : value;
}

function quoteValueIfNeeded(value: string | number) {
  if (isNumber(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '\\"')}"`;
}

export function enumCompiler(
  member: EnumMetadata,
  _options: CompilerOptions,
) {
  const { name: enumName, value: enumerator } = member;
  const keys = getEnumKeys(enumerator as object);
  // @ts-ignore: Index access
  const values = keys.map((key) => key.trim() ? `${quoteKeyIfNeeded(key)} = ${quoteValueIfNeeded(enumerator[key])}` : "").join(
    ",\n",
  );

  const code = `

export enum ${enumName} {
  ${values}
}
  `.trim();

  return code;
}
