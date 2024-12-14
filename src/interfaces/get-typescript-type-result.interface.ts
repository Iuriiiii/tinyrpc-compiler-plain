import type { TsType } from "../enums/mod.ts";

export interface GetTypescriptTypeResult {
  tsType: string;
  postfix: string;
  calculatedTsType: string;
  requireImport?: boolean;
  type: TsType;
}
