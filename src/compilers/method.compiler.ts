import type { CompilerOptions, MethodMetadata, ModuleMetadata, ParameterMetadata } from "@tinyrpc/server";
import type { Import } from "../interfaces/mod.ts";
import { camelToPascal, getTypescriptType, pushTypeIfNeeded, sassert } from "../utils/mod.ts";
import type { Constructor } from "../types/mod.ts";
import { paramCompiler } from "./param.compiler.ts";

function sortMethodParams(a: ParameterMetadata, b: ParameterMetadata) {
  return a.index - b.index;
}

export function methodCompiler(
  module: ModuleMetadata,
  method: MethodMetadata,
  imports: Import[],
  interfaces: string[],
  options: CompilerOptions,
) {
  const moduleName = module.moduleName ?? module.name;
  const { name: methodName, links = [] } = method;
  const typeResult = getTypescriptType(
    method.returnType as string | Constructor,
    options.metadata,
  );

  const { calculatedTsType: returnType } = typeResult;
  const generics = sassert(method.generics && `<${method.generics.join(", ")}>`);
  const makeVoid = sassert(returnType === "void" && "void ");
  const paramNames = method.params.map((p) => p.name!).reverse().join(", ");
  const areParams = method.params.length > 0;
  const buildOptionalFirstArgument = sassert(!areParams && " = {}");
  const buildedParams = method.params
    .sort(sortMethodParams)
    .map((p) => paramCompiler(method, p, imports, options))
    .join("; ");
  const interfaceName = `${camelToPascal(methodName)}Params`;
  const _return = makeVoid ? `return { ...response, result: void 0 };` : `return response;`;
  const output = `async ${methodName}${generics}({${paramNames}}: ${interfaceName}${buildOptionalFirstArgument}, request: RequestBody = {}): Promise<MethodResponse<${returnType}>> {
    const argument = {
      connection: {
        module: "${moduleName}",
        method: "${methodName}",
      },
      args: { ${paramNames} },
      updates: {
        parent: this,
        keys: ${JSON.stringify(links)} as unknown as MapStructure<object>,
      },
      request
    };

    const response = await rpc<${returnType}, HttpError>(argument);

    ${_return}
}`;

  pushTypeIfNeeded(typeResult, imports, options);

  interfaces.push(`interface ${interfaceName}{${buildedParams}}`);
  return output;
}
