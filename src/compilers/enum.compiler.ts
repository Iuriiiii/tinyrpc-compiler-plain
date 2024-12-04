import type { CompilerOptions, EnumMetadata } from "@tinyrpc/server/types";
import { isNumber } from "@online/is";

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
  const entries = Object.entries(enumerator as object);
  const values = entries.map(([key, value]) => `${quoteKeyIfNeeded(key)} = ${quoteValueIfNeeded(value)}`).join(",\n");

  const code = `

export enum ${enumName} {
  ${values}
}
  `.trim();

  return code;
}
