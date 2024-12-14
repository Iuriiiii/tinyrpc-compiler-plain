import type { TsType } from "../enums/mod.ts";

export interface ToTsResponse {
  arrayLevel: number;
  type: TsType;
  /**
   * The compiled expression.
   */
  compiled: string;
  /**
   * The datatype name
   */
  dataType: string;
}
