import {
  formatFolder,
  randomString,
  toFilename,
  writeFile,
} from "../utils/mod.ts";
import { buildModule } from "./build-module.compile.ts";
import sdkDenoJson from "../assets/deno.json" with { type: "json" };
import { buildStructure } from "./build-structure.compile.ts";
import type { CompilerOptions } from "@tinyrpc/server";

function createPackageFolder(path: string) {
  try {
    Deno.removeSync(path, { recursive: true });
  } catch {
    // nop
  }
  Deno.mkdirSync(path);
}

export function compilePackage(options: CompilerOptions) {
  const { structures, modules } = options.metadata;
  const { server } = options;
  const {
    path = `${Deno.cwd()}/plain-sdk`,
    name: packageName = `tinyrpc-sdk-${randomString()}`,
    version: packageVersion = "0.1.0",
  } = options.sdkOptions ?? {};
  const apiPath = `${path}/api`;
  const structurePath = `${path}/structures`;

  createPackageFolder(path);
  createPackageFolder(structurePath);

  for (const structure of structures) {
    const { name: structureName } = structure;

    writeFile(
      `${structurePath}/${toFilename(structureName, "structure")}`,
      buildStructure(structure, options),
    );
  }

  writeFile(
    `${structurePath}/mod.ts`,
    structures.map((structure) =>
      `export * from "./${toFilename(structure.name, "structure")}";`
    ).join("\n"),
  );

  createPackageFolder(apiPath);

  for (const module of modules) {
    const moduleName = module.moduleName ?? module.name;

    writeFile(
      `${apiPath}/${toFilename(moduleName, "api")}`,
      buildModule(module, options),
    );
  }

  writeFile(
    `${apiPath}/mod.ts`,
    modules.map((module) =>
      `export * from "./${toFilename(module.name, "api")}";`
    ).join("\n"),
  );

  const modApi = modules.length ? 'export * from "./api/mod.ts";' : "";
  const modStructures = structures.length
    ? 'export * from "./structures/mod.ts";'
    : "";
  const host = `http://${server?.hostname ?? "127.0.0.1"}:${
    server?.port ?? "8000"
  }/`;

  writeFile(
    `${path}/mod.ts`,
    [
      modApi,
      modStructures,
      'import { configSdk } from "@tinyrpc/sdk-core";',
      'import { dateSerializer, dateDeserializer } from "@online/tinyserializers";',
      `configSdk({
        host: "${host}",
        https: false,
        serializers: [dateSerializer],
        deserializers: [dateDeserializer]
      });`,
    ].join("\n"),
  );

  sdkDenoJson.name = packageName.toLowerCase();
  sdkDenoJson.version = packageVersion;

  writeFile(
    `${path}/deno.json`,
    JSON.stringify(sdkDenoJson, null, 4),
  );

  formatFolder(path);
}
