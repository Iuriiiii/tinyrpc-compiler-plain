import type { TsType } from "../enums/mod.ts";

export interface ToTsResponse {
  arrayLevel: number;
  tsType: TsType;
  /**
   * The compiled expression.
   */
  compiled: string;
  /**
   * The datatype name
   */
  dataTypeName: string;

  serializable?: boolean;
}
