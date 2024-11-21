import type { CompilerInformation, CompilerOptions } from "@tinyrpc/server";
import { compilePackage } from "./src/compilers/mod.ts";

export const CompilerPlain: CompilerInformation = {
  name: "Compiler Plain",
  // deno-lint-ignore require-await
  compiler: async (options: CompilerOptions) => {
    return compilePackage(options);
  },
};
