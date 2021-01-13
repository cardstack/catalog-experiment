var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
export { isLength as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSUoWyoaXNMZW5ndGgJwJuXoW8AAAHAkQXAl6FvAAACCJDAmKFnAAEDBZDAwpmhZAQTBMCSBALAwpihbLBNQVhfU0FGRV9JTlRFR0VSkgQHwMDAAtlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzTGVuZ3RoLmpzmKFyABDAwJEDwMKZoWQBAwbAkwcGA8DCmKFsqGlzTGVuZ3RokgYKwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzTGVuZ3RoLmpzmKFyCQjAB5EFwMKYoXJYEMDAkQPAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgAIwMCRBcDC
====catalogjs annotation end====*/