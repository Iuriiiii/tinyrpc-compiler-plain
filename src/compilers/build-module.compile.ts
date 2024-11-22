import type { CompilerOptions, MethodMetadata, ModuleMetadata } from "@tinyrpc/server";
import { buildMember } from "./build-member.compile.ts";
import { buildMethod } from "./build-method.compile.ts";
import { isUndefined } from "jsr:@online/is@0.0";
import { paramCompiler } from "./param.compiler.ts";
import { toFilename } from "../utils/mod.ts";

export function buildModule(module: ModuleMetadata, options: CompilerOptions) {
  const imports: string[] = [];
  const interfaces: string[] = [];
  const { name: moduleName, methods, members: allMembers } = module;

  const isSerializable = !!options.metadata.structures.find(
    (s) => s.constructor === module.constructor,
  );

  const members = allMembers
    .filter((m) => isUndefined(m.constructorParam));

  const compiledMembers = members
    .map((m) => buildMember(m, imports, options))
    .join("\n");

  const constructorParams = allMembers
    .filter((m) => !isUndefined(m.constructorParam))
    .sort((m1, m2) => m1.constructorParam! - m2.constructorParam!);

  const compiledConstructorParams = constructorParams
    .map((m) => paramCompiler(m, imports, options))
    .join(", ");

  const compiledStructureImports = imports
    .map((i) => {
      const compiledImportPath = `./${toFilename(i, "structure")}`;
      return `import { ${i} } from "${compiledImportPath}";`;
    })
    .join("\n");

  const methodsMapper = () => (method: MethodMetadata) => buildMethod(module, method, imports, interfaces, options);

  const constructorParamNames = constructorParams.map((m) => `this.${m.name}`).join(", ");
  const constructor = constructorParams.length ? `constructor(${compiledConstructorParams}){super();}` : "";
  const memberNames = members.map((m) => m.name);
  const membersObject = memberNames.map((memberName) => `${memberName}: this.${memberName}`).join(",\n");
  const buildedMethods = methods.map(methodsMapper()).join("\n\n");
  const buildedInterfaces = interfaces.join("\n");
  const compiledImports = imports
    .join(", ");

  const compiledImportPath = `import { ${compiledImports} } from "../structures/mod.ts"`;
  const _extends = isSerializable ? "extends SerializableClass " : "";

  const serializableMethod = !isSerializable ? "" : `
  public override serialize(): SerializedClass<typeof ${moduleName}> {
    return {
      arguments: [${constructorParamNames}],
      members: {${membersObject}}
    }
  }
`;

  const output = `
// deno-lint-ignore-file no-empty-interface
import {
  HttpError,
  MethodResponse,
  RequestBody,
  rawRpc as rpc,
  MapStructure
} from "@tinyrpc/sdk-core";
${compiledStructureImports}
${compiledImportPath}

${buildedInterfaces}

export class ${moduleName} ${_extends}{
    ${compiledMembers}
    ${constructor}
    ${buildedMethods}

    ${serializableMethod}
}
`.trim();

  return output;
}
