import { isUndefined } from "jsr:@online/is@0.0";
import { toFilename } from "../utils/mod.ts";
import { buildMember } from "./build-member.compile.ts";
import type { CompilerOptions, StructureMetadata } from "@tinyrpc/server";
import { paramCompiler } from "./param.compiler.ts";

export function buildStructure(
  structure: StructureMetadata,
  options: CompilerOptions,
) {
  const imports: string[] = [];
  const { name, members: allMembers } = structure;
  const members = allMembers
    .filter((m) => !!m.constructorParam);

  const compiledMembers = members
    .map((m) => buildMember(m, imports, options))
    .join("\n");

  const constructorParams = allMembers
    .filter((m) => !isUndefined(m.constructorParam))
    .sort((m1, m2) => m1.constructorParam! - m2.constructorParam!);

  const compiledConstructorParams = constructorParams
    .map((m) => paramCompiler(m, imports, options))
    .join(", ");

  const compiledImports = imports
    .map((i) => {
      const compiledImportPath = `./${toFilename(i, "structure")}`;
      return `import { ${i} } from "${compiledImportPath}";`;
    })
    .join("\n");

  const memberNames = members.map((m) => m.name);
  const constructorParamNames = constructorParams.map((m) => `this.${m.name}`).join(", ");
  const membersObject = memberNames.map((memberName) => `${memberName}: this.${memberName}`).join(",\n");
  const constructor = constructorParams.length ? `constructor(${compiledConstructorParams}){super();}` : "";

  const output = `
import { Serializable, SerializableClass, SerializedClass } from "@tinyrpc/sdk-core";
${compiledImports}

@Serializable()
export class ${name} extends SerializableClass {
  ${compiledMembers}

  ${constructor}

  public override serialize(): SerializedClass<typeof ${name}> {
    return {
      arguments: [${constructorParamNames}],
      members: {${membersObject}}
    }
  }
}
`.trim();

  return output;
}
