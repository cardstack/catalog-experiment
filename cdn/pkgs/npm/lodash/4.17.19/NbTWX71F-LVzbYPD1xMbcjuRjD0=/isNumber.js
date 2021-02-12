import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var numberTag = '[object Number]';
function isNumber(value) {
  return typeof value == 'number' || isObjectLike(value) && baseGetTag(value) == numberTag;
}
export { isNumber as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJWhbKhpc051bWJlchHAwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqmJhc2VHZXRUYWeSAg7AAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGlzT2JqZWN0TGlrZZIFDcABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQEcBAeQwMIBwsDAl6FvAQAIEJDAmKFnAAEJC5DAwpmhZAQUCsCSCgjAwpmhbKludW1iZXJUYWeSCg/AwMAIkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzTnVtYmVyLmpzmKFyAAnAwJEJwMKZoWQBAwzAlQ0ODwwJwMKZoWyoaXNOdW1iZXKSDBLAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzTnVtYmVyLmpzmKFyCQjADZELwMKYoXIvDMAOkQTAwpihcgsKwA+RAcDCmKFyCwnAwJEJwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACMDAkQvAwg==
====catalogjs annotation end====*/