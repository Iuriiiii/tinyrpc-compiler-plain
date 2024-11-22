import type { Import } from "../interfaces/mod.ts";

export function importCompiler(imports: Import[]) {
  const lines: string[] = [];

  for (const i of imports) {
    lines.push(`import { ${i.type} } from "${i.folder}/${i.fileName}";`);
  }

  return lines;
}
