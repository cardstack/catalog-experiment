import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var symbolTag = '[object Symbol]';
function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
export { isSymbol as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJShbKhpc1N5bWJvbBHA3AATl6FvAAADwJELwJmhZAkAAsCRAsDCmKFpqmJhc2VHZXRUYWeSAg7AAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsaXNPYmplY3RMaWtlkgUNwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBHAQHkMDCAcLAwJehbwEACBCQwJihZwABCQuQwMKZoWQEFArAkgoIwMKYoWypc3ltYm9sVGFnkgoPwMDACNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzU3ltYm9sLmpzmKFyAAnAwJEJwMKZoWQBAwzAlQ0ODwwJwMKYoWyoaXNTeW1ib2ySDBLAwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNTeW1ib2wuanOYoXIJCMANkQvAwpihci8MwA6RBMDCmKFyCwrAD5EBwMKYoXILCcDAkQnAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAIwMCRC8DC
====catalogjs annotation end====*/