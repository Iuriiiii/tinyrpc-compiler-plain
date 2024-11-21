import { stringToUID } from "./string-to-uid.util.ts";

export function objectToUID<T extends object>(obj: T) {
  let result = 0;

  for (const [key, value] of Object.entries(obj)) {
    result += stringToUID(key);

    if (typeof value === "string") {
      result += stringToUID(value);
    } else if (typeof value === "object") {
      result += objectToUID(value);
    } else if ("toString" in value) {
      result += stringToUID(value.toString());
    }
  }

  return result;
}
