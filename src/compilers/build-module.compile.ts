import type {
  CompilerOptions,
  MethodMetadata,
  ModuleMetadata,
} from "@tinyrpc/server";
import { buildMember } from "./build-member.compile.ts";
import { buildMethod } from "./build-method.compile.ts";

export function buildModule(module: ModuleMetadata, options: CompilerOptions) {
  const imports: string[] = [];
  const interfaces: string[] = [];
  const { name, methods, members } = module;
  const { moduleName = name } = module;
  const methodsMapper = () => (method: MethodMetadata) =>
    buildMethod(module, method, imports, interfaces, options);

  const buildedMembers = members
    .map((m) => buildMember(m, imports, options))
    .join("\n");
  const buildedMethods = methods.map(methodsMapper()).join("\n\n");
  const buildedInterfaces = interfaces.join("\n");
  const compiledImports = imports
    .join(", ");
  const compiledImportPath =
    `import { ${compiledImports} } from "../structures/mod.ts"`;

  const output = `
// deno-lint-ignore-file no-empty-interface
import {
  HttpError,
  MethodResponse,
  RequestBody,
  rawRpc as rpc,
  MapStructure
} from "@tinyrpc/sdk-core";
${compiledImportPath}
${buildedInterfaces}

export class ${moduleName} {
    ${buildedMembers}

    ${buildedMethods}
}
`.trim();

  return output;
}
