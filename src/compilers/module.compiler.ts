import { SerializableClass } from "@tinyrpc/server";
import type { CompilerOptions, MethodMetadata, ModuleMetadata } from "@tinyrpc/server/types";
import type { Import } from "../interfaces/mod.ts";
import { memberCompiler } from "./member.compiler.ts";
import { methodCompiler } from "./method.compiler.ts";
import { isUndefined } from "@online/is";
import { constructorParamCompiler } from "./constructor-param.compiler.ts";
import { importCompiler } from "./import.compiler.ts";
import { sassert } from "../utils/mod.ts";

export function moduleCompiler(module: ModuleMetadata, options: CompilerOptions) {
  const imports: Import[] = [];
  const interfaces: string[] = [];
  const { name: moduleName, methods, members: allMembers } = module;
  const isSerializable = module.constructor.prototype instanceof SerializableClass;
  const methodsMapper = () => (method: MethodMetadata) => methodCompiler(module, method, imports, interfaces, options);

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

  const constructorParamNames = constructorParams.map((m) => `this.${m.name}`).join(", ");
  const constructor = sassert(constructorParams.length > 0 && `constructor(${compiledConstructorParams}){${sassert(isSerializable && "super();")}}`);
  const memberNames = members.map((m) => m.name);
  const membersObject = memberNames.map((memberName) => `${memberName}: this.${memberName}`).join(",\n");
  const buildedMethods = methods.map(methodsMapper()).join("\n\n");
  const buildedInterfaces = interfaces.join("\n");
  const compiledImports = importCompiler(imports).join("");

  const _extends = sassert(isSerializable && "extends SerializableClass ");
  const serializableImports = sassert(isSerializable && "SerializableClass, type SerializedClass, Serializable");
  const serializableMethod = sassert(
    isSerializable && `
  public override serialize(): SerializedClass<typeof ${moduleName}> {
    return {
      arguments: [${constructorParamNames}],
      members: {${membersObject}}
    }
  }
`,
  );

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

${sassert(isSerializable && "@Serializable()")}
export class ${moduleName} ${_extends}{
    ${compiledMembers}
    ${constructor}
    ${buildedMethods}

    ${serializableMethod}
}
`.trim();

  return output;
}
