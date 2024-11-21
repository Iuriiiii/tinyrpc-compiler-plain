import { readFile } from "./read-file.util.ts";
import { writeFile } from "./write-file.util.ts";

export function copyFile(
  from: string,
  to: string,
  replaces: Record<string, string> = {},
) {
  writeFile(to, readFile(from, replaces));
}
