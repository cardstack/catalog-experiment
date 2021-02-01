export function requireHasNonStringLiteralSpecifier(moduleHref: string) {
  return () => {
    throw new Error(
      `CatalogJS runtime error: a 'require()' with a non-string literal specifier was evaluated in module ${moduleHref}. require() with non-string literal specifier is not currently supported in CatalogJS`
    );
  };
}
export function importHasNonStringLiteralSpecifier(moduleHref: string) {
  return () => {
    throw new Error(
      `CatalogJS runtime error: a dynamic import, 'import()', with a non-string literal specifier was evaluated in module ${moduleHref}. import() with non-string literal specifier is not currently supported in CatalogJS`
    );
  };
}
