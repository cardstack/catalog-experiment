import { default as baseFlatten } from "./dist/85.js";
import { default as map } from "./map.js";
import { default as toInteger } from "./toInteger.js";
function flatMapDepth(collection, iteratee, depth) {
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(map(collection, iteratee), depth);
}
export { flatMapDepth as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODUuanMDwsCVwqguL21hcC5qcwbCwJXCri4vdG9JbnRlZ2VyLmpzCcLAgadkZWZhdWx0lKFsrGZsYXRNYXBEZXB0aBHA3AATl6FvAAADwJDAmaFkCQACwJECwMKYoWmrYmFzZUZsYXR0ZW6SAg7AAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmjbWFwkgUPwAGnZGVmYXVsdMDAmKFyCwPAwJEEwMKcoWkBEwQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqXRvSW50ZWdlcpIIDcACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARkHCpDAwgLCwMCXoW8BAAsQkMCZoWQAIQzAlA0ODwzAwpihbKxmbGF0TWFwRGVwdGiSDBLAwMDA2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmxhdE1hcERlcHRoLmpzmKFyCQzADZELwMKYoXJECcAOkQfAwpihchILwA+RAcDCmKFyAQPAwJEEwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIADMDAkQvAwg==
====catalogjs annotation end====*/