import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var numberTag = '[object Number]';
function isNumber(value) {
  return typeof value == 'number' || isObjectLike(value) && baseGetTag(value) == numberTag;
}
export { isNumber as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJShbKhpc051bWJlchHA3AATl6FvAAADwJELwJmhZAkAAsCRAsDCmKFpqmJhc2VHZXRUYWeSAg7AAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsaXNPYmplY3RMaWtlkgUNwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBHAQHkMDCAcLAwJehbwEACBCQwJihZwABCQuQwMKZoWQEFArAkgoIwMKYoWypbnVtYmVyVGFnkgoPwMDACNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzTnVtYmVyLmpzmKFyAAnAwJEJwMKZoWQBAwzAlQ0ODwwJwMKYoWyoaXNOdW1iZXKSDBLAwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNOdW1iZXIuanOYoXIJCMANkQvAwpihci8MwA6RBMDCmKFyCwrAD5EBwMKYoXILCcDAkQnAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAIwMCRC8DC
====catalogjs annotation end====*/