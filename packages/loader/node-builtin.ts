export function requireNodeBuiltin(module: string) {
  throw new Error(
    `CatalogJS runtime error: nodejs builtin ${module} was require()'ed.`
  );
}
