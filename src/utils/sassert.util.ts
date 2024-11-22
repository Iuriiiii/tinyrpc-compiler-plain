/**
 * String assert
 */
export function sassert(value: boolean | undefined | string, defaultValue = "") {
  if (!value) {
    return defaultValue;
  }

  return value;
}
