import { type CompilerOptions, type MethodMetadata, type ModuleMetadata, SerializableClass } from "@tinyrpc/server";
import type { Import } from "../interfaces/mod.ts";
import { buildMember } from "./build-member.compile.ts";
import { buildMethod } from "./build-method.compile.ts";
import { isUndefined } from "jsr:@online/is@0.0";
import { paramCompiler } from "./param.compiler.ts";
import { importCompiler } from "./import.compiler.ts";

export function buildModule(module: ModuleMetadata, options: CompilerOptions) {
  const imports: Import[] = [];
  const interfaces: string[] = [];
  const { name: moduleName, methods, members: allMembers } = module;
  const isSerializable = module.constructor.prototype instanceof SerializableClass;

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

  const methodsMapper = () => (method: MethodMetadata) => buildMethod(module, method, imports, interfaces, options);

  const constructorParamNames = constructorParams.map((m) => `this.${m.name}`).join(", ");
  const constructor = constructorParams.length ? `constructor(${compiledConstructorParams}){${isSerializable ? "super();" : ""}}` : "";
  const memberNames = members.map((m) => m.name);
  const membersObject = memberNames.map((memberName) => `${memberName}: this.${memberName}`).join(",\n");
  const buildedMethods = methods.map(methodsMapper()).join("\n\n");
  const buildedInterfaces = interfaces.join("\n");
  const compiledImports = importCompiler(imports);

  const _extends = isSerializable ? "extends SerializableClass " : "";
  const serializableImports = isSerializable ? "SerializableClass, type SerializedClass, Serializable" : "";
  const serializableMethod = !isSerializable ? "" : `
  public override serialize(): SerializedClass<typeof ${moduleName}> {
    return {
      arguments: [${constructorParamNames}],
      members: {${membersObject}}
    }
  }
`;

  const output = `
// deno-lint-ignore-file
import {
  HttpError,
  MethodResponse,
  RequestBody,
  rawRpc as rpc,
  MapStructure,
  ${serializableImports}
} from "@tinyrpc/sdk-core";
${compiledImports}

${buildedInterfaces}

${isSerializable ? "@Serializable()" : ""}
export class ${moduleName} ${_extends}{
    ${compiledMembers}
    ${constructor}
    ${buildedMethods}

    ${serializableMethod}
}
`.trim();

  return output;
}
