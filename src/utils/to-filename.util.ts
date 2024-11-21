import { pascalToKebab } from "./pascal-to-kebab.util.ts";

export function toFilename(name: string, postfix: string) {
  return `${pascalToKebab(name).toLowerCase()}.${postfix}.ts`;
}
