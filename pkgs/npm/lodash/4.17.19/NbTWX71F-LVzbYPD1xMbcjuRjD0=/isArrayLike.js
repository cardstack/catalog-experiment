import { default as isFunction } from "./isFunction.js";
import { default as isLength } from "./isLength.js";
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
export { isArrayLike as default };
/*====catalogjs annotation start====
k5KVwq8uL2lzRnVuY3Rpb24uanMDwsCVwq0uL2lzTGVuZ3RoLmpzBsLAgadkZWZhdWx0lKFsq2lzQXJyYXlMaWtlDcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmqaXNGdW5jdGlvbpICC8AAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABoBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahpc0xlbmd0aJIFCsABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQACgnAkwoLCcDCmKFsq2lzQXJyYXlMaWtlkgkOwMDAwNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzQXJyYXlMaWtlLmpzmKFyCQvACpEIwMKYoXIkCMALkQTAwpihchMKwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAvAwJEIwMI=
====catalogjs annotation end====*/