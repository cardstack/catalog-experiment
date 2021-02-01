export function requireNodeBuiltin(module: string) {
  return () => {
    throw new Error(
      `CatalogJS runtime error: nodejs builtin '${module}' was require()'ed.`
    );
  };
}
