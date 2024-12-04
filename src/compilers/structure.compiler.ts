import type { CompilerOptions, StructureMetadata } from "@tinyrpc/server";
import type { Import } from "../interfaces/mod.ts";
import { isUndefined } from "@online/is";
import { memberCompiler } from "./member.compiler.ts";
import { constructorParamCompiler } from "./constructor-param.compiler.ts";
import { importCompiler } from "./import.compiler.ts";
import { sassert } from "../utils/mod.ts";

export function structureCompiler(
  structure: StructureMetadata,
  options: CompilerOptions,
) {
  const imports: Import[] = [];
  const { name, members: allMembers } = structure;
  const members = allMembers
    .filter((m) => isUndefined(m.constructorParam));

  const compiledMembers = members
    .map((m) => memberCompiler(m, imports, options))
    .join("\n");

  const constructorParams = allMembers
    .filter((m) => !isUndefined(m.constructorParam))
    .sort((m1, m2) => m1.constructorParam! - m2.constructorParam!);

  const compiledConstructorParams = constructorParams
    .map((m) => constructorParamCompiler(m, imports, options))
    .join(", ");

  const compiledImports = importCompiler(imports)
    .join("\n");

  const memberNames = members.map((m) => m.name);
  const constructorParamNames = constructorParams.map((m) => `this.${m.name}`).join(", ");
  const membersObject = memberNames.map((memberName) => `${memberName}: this.${memberName}`).join(",\n");
  const constructor = sassert(constructorParams.length > 0 && `constructor(${compiledConstructorParams}){super();}`);

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
