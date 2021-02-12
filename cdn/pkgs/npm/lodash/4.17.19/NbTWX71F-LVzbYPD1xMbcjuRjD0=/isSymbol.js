import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var symbolTag = '[object Symbol]';
function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
export { isSymbol as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJWhbKhpc1N5bWJvbBHAwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqmJhc2VHZXRUYWeSAg7AAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGlzT2JqZWN0TGlrZZIFDcABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQEcBAeQwMIBwsDAl6FvAQAIEJDAmKFnAAEJC5DAwpmhZAQUCsCSCgjAwpmhbKlzeW1ib2xUYWeSCg/AwMAIkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzU3ltYm9sLmpzmKFyAAnAwJEJwMKZoWQBAwzAlQ0ODwwJwMKZoWyoaXNTeW1ib2ySDBLAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzU3ltYm9sLmpzmKFyCQjADZELwMKYoXIvDMAOkQTAwpihcgsKwA+RAcDCmKFyCwnAwJEJwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACMDAkQvAwg==
====catalogjs annotation end====*/