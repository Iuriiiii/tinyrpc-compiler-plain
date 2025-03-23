import type { CompilerInformation, CompilerOptions } from "../tinyrpc/types.ts";
import type { CompilerPlainOptions } from "./src/interfaces/mod.ts";
import { compilePackage } from "./src/compilers/mod.ts";

export function CompilerPlain(config?: CompilerPlainOptions): CompilerInformation<CompilerPlainOptions> {
  return {
    name: "Compiler Plain",
    // deno-lint-ignore require-await
    compiler: async (options: CompilerOptions) => {
      return compilePackage(options, config);
    },
    custom: config,
  };
}
