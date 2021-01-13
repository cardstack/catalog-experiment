import { default as baseFlatten } from "./dist/85.js";
import { default as toInteger } from "./toInteger.js";
function flattenDepth(array, depth) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(array, depth);
}
export { flattenDepth as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODUuanMDwsCVwq4uL3RvSW50ZWdlci5qcwbCwIGnZGVmYXVsdJShbKxmbGF0dGVuRGVwdGgNwJ+XoW8AAAPAkQjAmaFkCQACwJECwMKYoWmrYmFzZUZsYXR0ZW6SAgvAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpdG9JbnRlZ2VykgUKwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGQQHkMDCAcLAwJehbwEACAyQwJmhZAARCcCTCgsJwMKYoWysZmxhdHRlbkRlcHRokgkOwMDAwNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZsYXR0ZW5EZXB0aC5qc5ihcgkMwAqRCMDCmKFyzIwJwAuRBMDCmKFyEgvAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIADMDAkQjAwg==
====catalogjs annotation end====*/