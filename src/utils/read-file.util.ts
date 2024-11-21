export function readFile(path: string, replaces: Record<string, string> = {}) {
  const content = Deno.readTextFileSync(path);

  return Object.entries(replaces).reduce((acc, [key, value]) => {
    return acc.replaceAll(key, value);
  }, content);
}
