import { isBoolean } from "jsr:@online/is@0.0";

/**
 * String assert
 */
export function sassert(value: boolean | undefined | string, defaultValue = "") {
  if (!value) {
    return defaultValue;
  }

  return value;
}
